#!/usr/bin/env python3
"""Linter for multi-level zoom boxes and markdown conventions in tutorial/*.md."""

from __future__ import annotations

import argparse
import re
import sys
import unicodedata
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

SCHEMES: Dict[str, Dict[int, Set[str]]] = {
    "new": {
        1: {"Picture"},
        2: {"Key idea"},
        3: {"Full derivation"},
    },
    "legacy": {
        1: {"Picture"},
        2: {
            "Full derivation",
            "Full derivation (optional)",
            "Result with intuition",
            "Short proofs",
            "Under the hood",
        },
        3: {"Toolkit", "Advanced"},
    },
}

DEFAULT_VECTORS = "r,p,J,X,v,L,A,B,E,F,k,φ,μ,Ω,ε,d,a,b,τ,s,ℰ"

# Regex patterns
FENCE_RE = re.compile(r"^\s*```")
IGNORE_RE = re.compile(
    r"<!--\s*lint-ignore:\s*([\w\-, ]+?)\s*(?:(?:—|\breason:)\s*(.*?))?\s*-->"
)
# Rules that may only be suppressed inline together with a written reason:
#   <!-- lint-ignore: nest-parent — why this box has no parent -->
NEEDS_REASON_RULES = {"nest-parent"}
DETAILS_OPEN_RE = re.compile(r"^<details(?:\s+([^>]*))?>$", re.IGNORECASE)
DETAILS_CLOSE_RE = re.compile(r"^</details>$", re.IGNORECASE)
SUMMARY_LINE_RE = re.compile(r"^<summary>(.*)</summary>$", re.IGNORECASE)
ANCHOR_SUFFIX_RE = re.compile(r"\s*\{#([A-Za-z0-9_-]+)\}\s*$")
HEADING_ANCHOR_RE = re.compile(r"^#{1,4}\s+.*\{#([A-Za-z0-9_-]+)\}\s*$")
SECTION_HEADING_RE = re.compile(r"^##\s+(\d+)\.(\d+)\b")
AUX_SUMMARY_RE = re.compile(
    r"^(?:answers?|app details:.*|.*\(app details\))$",
    re.IGNORECASE,
)
SUMMARY_FMT_RE = re.compile(r"^Level\s+([123])\s+·\s+([^:]+?):\s*(.+)$")
TUT_LINK_RE = re.compile(r"\[([^\]\n]+)\]\(tut:(\d{2})(?:#([A-Za-z0-9_-]+))?\)")
MD_LINK_URL_RE = re.compile(r"(\[[^\]]+\])\([^)]*\)")

# Content & inline checks
L1_SUP_EXP_RE = re.compile(r"\be\s*<sup>((?:(?!</sup>).)*)</sup>", re.IGNORECASE)
L1_CARET_EXP_RE = re.compile(
    r"\be\^(?:\{([^}]+)\}|\(([^)]+)\)|([±−+\-]?i(?=$|[\s}/*×·±−+\-0-9A-Zα-ωΑ-Ω]|[txkpmrφθωπδΔ])))"
)
IMAG_I_RE = re.compile(
    r"(?:^|[±−+\-\s(/*×·0-9])i(?=$|[\s()/*×·±−+\-0-9A-Zα-ωΑ-Ω]|[txkpmrφθωπδΔ])"
)
L1_FORBIDDEN_RE = re.compile(
    r"[∇∂∫∑ΣĤ]|[LpOρH]\u0302"
    r"|\bd²?(?:[A-Za-zψΨΦRPu]{1,3}|\([^)]+\))?/d[trxyzφθωΘτλρξ]²?(?![A-Za-z])"
)
L1_LABEL_EQ_RE = re.compile(
    r"\b(?:n|l|m(?:_l|_[xyz])?|B(?:_z)?|r|t|s)\s*=\s*[±−+-]?(?:\d+(?:\.\d+)?|½)(?![A-Za-z/²³])"
)
STEP_RE = re.compile(r"\bStep\s+\d+\b", re.IGNORECASE)
LEVEL_REF_RE = re.compile(r"\bLevel\s*[123]\b", re.IGNORECASE)
REL_BOX_REF_RE = re.compile(
    r"\b(?:derived below|in the box below|computed in the box|proofs?\s+in\s+the\s+[^.\n]{0,30}box"
    r"|box(?:es)?\s+(?:below|above))\b",
    re.IGNORECASE,
)
L2_POINTER_PHRASE_RE = re.compile(
    r"\b(?:full algebra|full derivation|step-by-step derivation)\b",
    re.IGNORECASE,
)
YOUNEED_RE = re.compile(
    r"^\s*(?:[-*]\s+)?(?:\*\*You need:?\*\*:?|You need:)",
    re.IGNORECASE,
)
CHECK_RE = re.compile(r"✓|\*\*Check\b[^*\n]*\*\*|^\s*Check:", re.MULTILINE)
FULL_ALGEBRA_LINK_RE = re.compile(
    r"Full algebra:\s*\[[^\]\n]+\]\(tut:(\d{2})#([A-Za-z0-9_-]+)\)"
)
FWD_BELOW_RE = re.compile(r"\b(?:demo|figure|example|section|table)s?\s+below\b", re.IGNORECASE)
BOLD_ITALIC_RE = re.compile(r"(?<!\*)\*\*\*([^*\s][^*]{0,15}?)\*\*\*(?!\*)")
WIKI_LINK_RE = re.compile(r"(?<!\[)\[\[([^\[\]\n]+)\]\](?!\()")
LIST_ITEM_RE = re.compile(r"^(?:[-*+]|\d+\.)\s")
FORWARD_DEFER_RE = re.compile(
    r"\b(?:proved|derived|shown)\s+later\b"
    r"|\bwe\s+(?:will|'ll)\s+(?:prove|derive|show)\b"
    r"|\bleft\s+(?:as\s+an\s+exercise|to\s+the\s+reader)\b"
    r"|\blater\s+chapter\b",
    re.IGNORECASE,
)
CHAPTER_MENTION_RE = re.compile(r"\b(?:Chapter|Ch\.)\s+(\d+)\b", re.IGNORECASE)
SECTION_REF_RE = re.compile(r"§\s*(\d+)\.(\d+)\b")
CALLOUT_START_RE = re.compile(r"^>\s*\*\*(?:(?!\*\*).)+[:?.]\*\*(?:\s|$)")
EQ_LINE_RE = re.compile(r"^\s*>(?!\s*(?:[-*]|\d+\.)\s).*[=≈∝]")
SI_SYM_RE = re.compile(r"ħ|m<[sS][uU][bB]>e</[sS][uU][bB]>|\bm_e\b|mₑ|ε₀")
UNITS_TAG_EXEMPT_RE = re.compile(
    r"\bSI\b|\(\s*a\.u\.|\(\s*atomic units|\ba\.u\.\s*[→↔]|ħ\s*=\s*(?:[^=\n]*=\s*)*1\b",
    re.IGNORECASE,
)
BOLD_SPAN_RE = re.compile(r"\*\*([^\n]+?)\*\*(?!\*)")
MATH_CHARS_RE = re.compile(r"[=∇∂∫∑ĤψΨΦ±×÷√∞≈∝≤≥≠⟨⟩]|<sup>")
INLINE_TAG_RE = re.compile(r"<(/?)(sub|sup|summary)\b[^>]*>", re.IGNORECASE)

# Bold-math exemptions (prose lead-ins, UI settings, kets, numeric dimensions/units)
MATH_FUNC_WORDS = {
    "sin", "cos", "tan", "cot", "sec", "csc", "exp", "log", "ln", "det",
    "lim", "max", "min", "re", "im", "arg", "tr", "mod", "sgn", "grad",
    "div", "curl", "au", "si", "dr", "dt", "dx", "dy", "dz", "dv", "ef", "kx",
}
PURE_KET_RE = re.compile(
    r"^(?:[±−+-]|\d+(?:\.\d+)?%\s+)?(?:\\?\|[^|⟩]+⟩|⟨[^|⟩]+\\?\|)"
    r"(?:\s*(?:→|↔|,|and|or|\+|−|-)\s*(?:[±−+-]|\d+(?:\.\d+)?%\s+)?(?:\\?\|[^|⟩]+⟩|⟨[^|⟩]+\\?\|))*$"
)
UI_SETTING_RE = re.compile(
    r"^[A-Z][a-z]+(?:\s+[A-Za-z]+)*\s*=\s*[±−+-]?\d+(?:\.\d+)?[°%×]?"
    r"(?:\s*,\s*[A-Z][a-z]+(?:\s+[A-Za-z]+)*\s*=\s*[±−+-]?\d+(?:\.\d+)?[°%×]?)*$"
)
NUMERIC_QTY_RE = re.compile(
    r"^[~±−+-]?\d+(?:\.\d+)?"
    r"(?:\s*(?:a\.u\.|eV|T|kT|nm|Hz)\s*=\s*[~±−+-]?\d+(?:\.\d+)?)?"
    r"(?:\s*[×x]\s*(?:10(?:[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+|<sup>[^<]+</sup>)|\d+(?:\.\d+)?)|\s*×)?"
    r"(?:\s*(?:T|kT|eV|nm|Hz|fs|ps|ns|s|a\.u\.|Ha|%|°|K|V/m|W/cm²|a₀|cycles?))?\.?$"
)


@dataclass
class Config:
    scheme: str = "new"
    strict: bool = False
    outline: bool = False
    ignore: Set[str] = field(default_factory=set)
    max_l2_eq: int = 5
    min_l2_eq: int = 0
    max_l1_equals: int = 2
    require_units: bool = False
    vectors: Set[str] = field(
        default_factory=lambda: set(DEFAULT_VECTORS.split(","))
    )


@dataclass
class Diagnostic:
    severity: str  # "ERR" or "WARN"
    rule: str
    path: str
    line: int
    message: str


@dataclass
class LinkRef:
    path: str
    line: int
    target_ch: str
    anchor: str
    ignored: Set[str]
    label: str = ""


@dataclass
class Box:
    path: str
    chapter_key: str
    start_line: int
    end_line: int = 0
    summary_line: int = 0
    level: Optional[int] = None
    label: str = ""
    title: str = ""
    anchor: Optional[str] = None
    is_aux: bool = False
    awaiting_summary: bool = True
    section: Optional[Tuple[int, int]] = None
    parent_all: Optional["Box"] = None
    zoom_parent: Optional["Box"] = None
    children_all: List["Box"] = field(default_factory=list)
    zoom_children: List["Box"] = field(default_factory=list)
    own_lines: List[Tuple[int, str, Set[str], bool]] = field(default_factory=list)
    total_own_lines: int = 0
    ignored_rules: Set[str] = field(default_factory=set)

    def eqs(self) -> List[Tuple[int, str]]:
        """Return display equation lines belonging directly to this box (excluding prose callouts)."""
        out: List[Tuple[int, str]] = []
        for ln, text, _, in_callout in self.own_lines:
            if in_callout:
                continue
            cleaned = re.sub(r"<[^>]+>", "", strip_code_placeholder(text))
            if EQ_LINE_RE.match(cleaned):
                out.append((ln, text))
        return out


def chapter_key_for(path: str) -> str:
    name = Path(path).name
    if len(name) >= 2 and name[:2].isdigit():
        return name[:2]
    return str(path)


def chapter_num_for(path: str) -> Optional[int]:
    name = Path(path).name
    if len(name) >= 2 and name[:2].isdigit():
        return int(name[:2])
    return None


def block_kind(trim: str) -> str:
    """Classify a stripped line by the Markdown block the renderer puts it in."""
    if trim.startswith(">"):
        body = trim[1:].strip()
        if not body:
            return "quote-blank"
        return "quote-item" if LIST_ITEM_RE.match(body) else "quote"
    if LIST_ITEM_RE.match(trim):
        return "item"
    if trim.startswith(("#", "|", "<", "```")):
        return "other"
    return "para"


def strip_code_placeholder(s: str) -> str:
    """Replace matched single- or multi-backtick code spans with 'CODE'."""
    out: List[str] = []
    i = 0
    n = len(s)
    while i < n:
        if s[i] == "`":
            k = 0
            while i + k < n and s[i + k] == "`":
                k += 1
            p = i + k
            found = -1
            while p < n:
                if s[p] == "`":
                    m = 0
                    while p + m < n and s[p + m] == "`":
                        m += 1
                    if m == k:
                        found = p + m
                        break
                    p += m
                else:
                    p += 1
            if found > 0:
                out.append("CODE")
                i = found
                continue
            out.append(s[i : i + k])
            i += k
            continue
        out.append(s[i])
        i += 1
    return "".join(out)


def find_l1_complex_exp(no_stars: str) -> Optional[str]:
    """Detect complex exponentials in Level 1 text, handling nested <sub> inside <sup>."""
    for m in L1_SUP_EXP_RE.finditer(no_stars):
        exp_body = re.sub(r"<[^>]+>", "", m.group(1)).strip()
        if IMAG_I_RE.search(exp_body):
            return m.group(0)
    for m in L1_CARET_EXP_RE.finditer(no_stars):
        exp_body = (m.group(1) or m.group(2) or m.group(3) or "").strip()
        if IMAG_I_RE.search(exp_body):
            return m.group(0)
    return None


def is_unit_hat_vector(inner: str) -> bool:
    """Return True for unit-vector hat symbols such as x̂, ŷ, ẑ, k̂, r̂."""
    nfd = unicodedata.normalize("NFD", inner)
    return len(nfd) == 2 and nfd[0].isalpha() and nfd[1] == "\u0302"


def is_prose_or_label_bold(inner: str) -> bool:
    """Return True for legitimate bold prose lead-ins, UI settings, kets, or numeric units."""
    if re.match(r"^Step\s+\d+\b", inner, re.IGNORECASE):
        return True
    if PURE_KET_RE.match(inner):
        return True
    if UI_SETTING_RE.match(inner):
        return True
    if NUMERIC_QTY_RE.match(inner):
        return True
    # Strip HTML tags/super/subscripts, Dirac kets, parenthetical math, and italics
    s = re.sub(r"<su[bp]>.*?</su[bp]>", " ", inner, flags=re.IGNORECASE)
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"\\?\|[^|⟩]+⟩", " ", s)
    s = re.sub(r"\([^)]*[=∇∂∫∑ĤψΨΦ±×÷√∞≈∝≤≥≠][^)]*\)", " ", s)
    s = s.replace("*", "")
    words = [w for w in re.findall(r"[A-Za-z]{2,}", s) if w.lower() not in MATH_FUNC_WORDS]
    if len(words) >= 2:
        return True
    if len(words) == 1 and len(words[0]) >= 3 and inner.rstrip().endswith((":", ".")):
        return True
    if len(words) == 1 and len(words[0]) >= 4 and not re.search(r"[=±×÷√∞≈∝≤≥≠/]|<sup>", inner):
        return True
    if len(words) == 1 and re.search(r"-\d+\b", s):
        return True
    return False


def strip_line_comments_and_ignores(
    raw: str, in_comment: bool, unreasoned: Optional[Set[str]] = None
) -> Tuple[str, Set[str], bool, bool]:
    """Single-pass per-line HTML comment & lint-ignore scanner matching the viewer.

    - Inside comment mode: backticks and fences are ignored until `-->`.
    - Outside comment mode: single- and multi-backtick code spans protect `<!--`
      from starting a comment or triggering `lint-ignore`.
    Returns (clean_line, extracted_ignores, next_in_comment, had_comment).
    Rules in NEEDS_REASON_RULES are only honoured when the comment carries a
    reason ("— reason" or "reason: ..."); otherwise they are added to the
    optional `unreasoned` set instead of the returned ignores.
    """
    ignores: Set[str] = set()
    had_comment = False
    out: List[str] = []
    i = 0
    n = len(raw)

    while i < n:
        if in_comment:
            had_comment = True
            end = raw.find("-->", i)
            if end < 0:
                return "".join(out), ignores, True, True
            i = end + 3
            in_comment = False
            continue

        ch = raw[i]
        if ch == "`":
            k = 0
            while i + k < n and raw[i + k] == "`":
                k += 1
            p = i + k
            found = -1
            while p < n:
                if raw[p] == "`":
                    m = 0
                    while p + m < n and raw[p + m] == "`":
                        m += 1
                    if m == k:
                        found = p + m
                        break
                    p += m
                else:
                    p += 1
            if found > 0:
                out.append(raw[i:found])
                i = found
                continue
            out.append(raw[i : i + k])
            i += k
            continue

        if raw.startswith("<!--", i):
            had_comment = True
            end = raw.find("-->", i + 4)
            if end >= 0:
                seg = raw[i : end + 3]
                for im in IGNORE_RE.finditer(seg):
                    has_reason = bool((im.group(2) or "").strip())
                    for tok in re.split(r"[,\s]+", im.group(1).strip()):
                        if not tok:
                            continue
                        tok = tok.lower()
                        if tok in NEEDS_REASON_RULES and not has_reason:
                            if unreasoned is not None:
                                unreasoned.add(tok)
                            continue
                        ignores.add(tok)
                i = end + 3
                continue
            in_comment = True
            break

        out.append(ch)
        i += 1

    return "".join(out), ignores, in_comment, had_comment


class Linter:
    def __init__(self, cfg: Config) -> None:
        self.cfg = cfg
        self.diags: List[Diagnostic] = []
        self.boxes: List[Box] = []
        self.top_boxes: List[Box] = []
        self.anchors_by_ch: Dict[str, Dict[str, Tuple[str, int]]] = {}
        self.links: List[LinkRef] = []
        self.passed_chapters: Set[str] = set()
        self.box_titles: Dict[Tuple[str, str], str] = {}

    def emit(
        self,
        severity: str,
        rule: str,
        path: str,
        line: int,
        message: str,
        ignored: Optional[Set[str]] = None,
    ) -> bool:
        r = rule.lower()
        if "all" in self.cfg.ignore or r in self.cfg.ignore:
            return False
        if ignored and ("all" in ignored or r in ignored):
            return False
        self.diags.append(Diagnostic(severity, rule, path, line, message))
        return True

    def register_anchor(
        self,
        ch_key: str,
        anchor: str,
        path: str,
        line: int,
        ignored: Set[str],
    ) -> None:
        ch_map = self.anchors_by_ch.setdefault(ch_key, {})
        if anchor in ch_map:
            prev_path, prev_line = ch_map[anchor]
            self.emit(
                "ERR",
                "dup-anchor",
                path,
                line,
                f"Duplicate anchor {{#{anchor}}} in chapter {ch_key} (first defined at {prev_path}:{prev_line})",
                ignored,
            )
        else:
            ch_map[anchor] = (path, line)

    def check_line_inline(
        self,
        path: str,
        line_no: int,
        clean_line: str,
        ignored: Set[str],
        *,
        is_summary: bool = False,
        in_l2: bool = False,
        in_callout: bool = False,
        defer_bold: bool = False,
        eq_context: str = "",
    ) -> bool:
        """Run per-line inline checks.

        Returns True when the line has an odd number of ``**`` markers. With
        ``defer_bold`` the caller decides whether that bold continues onto the
        next line of the same paragraph/blockquote (the renderer joins those
        lines); otherwise an odd count is reported immediately.
        `eq_context` holds the following lines of the same blockquote, so a units
        tag on a later line of a multi-line display equation is recognised.
        """
        # Strip inline code spans using non-empty placeholder so **`code`** stays **CODE**
        nocode = strip_code_placeholder(clean_line)

        # 1. Backtick balance (any leftover unescaped backticks after matching code spans)
        if "`" in nocode.replace("\\`", ""):
            self.emit(
                "WARN",
                "backtick-balance",
                path,
                line_no,
                "Odd/unmatched backtick on line",
                ignored,
            )

        # 2. Tag balance for <sub>, <sup>, <summary>
        tag_stack: List[str] = []
        tag_bad = False
        for tm in INLINE_TAG_RE.finditer(nocode):
            is_close = bool(tm.group(1))
            tag = tm.group(2).lower()
            if not is_close:
                tag_stack.append(tag)
            else:
                if not tag_stack or tag_stack[-1] != tag:
                    tag_bad = True
                    break
                tag_stack.pop()
        if tag_bad or tag_stack:
            self.emit(
                "ERR",
                "tag-balance",
                path,
                line_no,
                "Unbalanced inline HTML tags (<sub>/<sup>/<summary>)",
                ignored,
            )

        # 3. Level reference in prose (never on <summary>)
        if not is_summary and LEVEL_REF_RE.search(nocode):
            self.emit(
                "ERR",
                "level-ref",
                path,
                line_no,
                "Prose references 'Level N' directly; link to a box by title/anchor instead",
                ignored,
            )

        # 4. Leftover relative box references (outside L2 pointer lines)
        if not is_summary and REL_BOX_REF_RE.search(nocode):
            is_l2_pointer_line = in_l2 and (
                bool(L2_POINTER_PHRASE_RE.search(nocode))
                or bool(TUT_LINK_RE.search(nocode))
            )
            if not is_l2_pointer_line:
                self.emit(
                    "WARN",
                    "rel-box-ref",
                    path,
                    line_no,
                    "Relative box reference; link to a box by title/anchor instead",
                    ignored,
                )

        # 5. Units tag on display equations (skip prose callouts). The tag may sit
        #    on a later line of the same multi-line blockquote equation.
        if not is_summary and not in_callout and EQ_LINE_RE.match(re.sub(r"<[^>]+>", "", nocode)):
            si_check_text = nocode.replace("*", "")
            tag_text = si_check_text + "\n" + eq_context.replace("*", "")
            has_tag = bool(UNITS_TAG_EXEMPT_RE.search(tag_text))
            if SI_SYM_RE.search(si_check_text) and not has_tag:
                self.emit(
                    "WARN",
                    "units-tag",
                    path,
                    line_no,
                    "Display equation uses SI constants (ħ, m_e, ε₀) without an explicit (SI) tag",
                    ignored,
                )
            elif self.cfg.require_units and not has_tag:
                self.emit(
                    "WARN",
                    "units-tag",
                    path,
                    line_no,
                    "Display equation has no (SI) or (a.u.) tag (pure math identities may be exempted with lint-ignore)",
                    ignored,
                )

        # 5b. [[Title]] wiki-style links are not supported by the renderer
        if not is_summary:
            for wm in WIKI_LINK_RE.finditer(nocode):
                inner = wm.group(1)
                if re.search(r"[A-Za-z]{3,}\s+[A-Za-z]{2,}", inner) and "," not in inner:
                    self.emit(
                        "ERR",
                        "wiki-link",
                        path,
                        line_no,
                        f"'[[{inner}]]' is not a supported link; use [Box title](tut:NN#anchor)",
                        ignored,
                    )

        # 5c. ***x*** renders as bold-italic; bold marks 3D vectors only
        for bm in BOLD_ITALIC_RE.finditer(nocode.replace("\\*", "")):
            self.emit(
                "WARN",
                "bold-italic",
                path,
                line_no,
                f"'***{bm.group(1)}***' renders bold-italic; use *{bm.group(1)}* for scalars or **{bm.group(1)}** for vectors",
                ignored,
            )

        # 6. Bold balance, bold-nested, bold-math
        no_esc = nocode.replace("\\*", "")
        stars_count = len(re.findall(r"\*\*", no_esc))
        if stars_count % 2 != 0:
            if not defer_bold:
                self.emit(
                    "ERR",
                    "bold-balance",
                    path,
                    line_no,
                    "Unbalanced ** bold markers on line",
                    ignored,
                )
            return True

        spans = list(BOLD_SPAN_RE.finditer(no_esc))
        nested_indices: Set[int] = set()
        for idx, (a, b) in enumerate(zip(spans, spans[1:])):
            gap = no_esc[a.end() : b.start()]
            if (
                0 < len(gap) <= 3
                and not re.search(r"\s", gap)
                and re.search(r"[A-Za-z0-9α-ωΑ-Ωℰ]", gap)
            ):
                nested_indices.add(idx)
                nested_indices.add(idx + 1)
                self.emit(
                    "WARN",
                    "bold-nested",
                    path,
                    line_no,
                    f"Likely nested bold around {gap!r} (e.g. **...**{gap}**...**)",
                    ignored,
                )

        for idx, m in enumerate(spans):
            if idx in nested_indices:
                continue
            inner = m.group(1).strip()
            if not inner or is_unit_hat_vector(inner):
                continue
            if len(inner) == 1 and (inner.isalpha() or inner in self.cfg.vectors):
                if inner not in self.cfg.vectors:
                    self.emit(
                        "WARN",
                        "bold-math",
                        path,
                        line_no,
                        f"Bold single non-vector letter '**{inner}**'; use '*{inner}*' for scalars or add to --vectors",
                        ignored,
                    )
            elif MATH_CHARS_RE.search(inner) and not is_prose_or_label_bold(inner):
                self.emit(
                    "WARN",
                    "bold-math",
                    path,
                    line_no,
                    f"Math expression inside bold ('**{inner}**'); use italics for scalars and bold only for vectors/prose",
                    ignored,
                )
        return False

    def lint_file(self, path: str) -> None:
        text = Path(path).read_text(encoding="utf-8")
        lines = text.splitlines()
        ch_key = chapter_key_for(path)
        self.passed_chapters.add(ch_key)
        self.anchors_by_ch.setdefault(ch_key, {})

        all_stack: List[Box] = []
        zoom_stack: List[Box] = []
        in_fence = False
        in_html_comment = False
        comment_open_line: Optional[int] = None
        in_callout = False
        pending_ignore: Set[str] = set()
        current_section: Optional[Tuple[int, int]] = None
        # Bold opened on one line may close on a later line of the same plain
        # paragraph or blockquote (the renderer joins those lines); list items
        # and other blocks do not continue.
        bold_open: Optional[Tuple[int, Set[str], str]] = None

        def _flush_bold() -> None:
            nonlocal bold_open
            if bold_open is not None:
                b_line, b_ign, _ = bold_open
                self.emit(
                    "ERR",
                    "bold-balance",
                    path,
                    b_line,
                    "Unbalanced ** bold markers (bold opened here is not closed in the same paragraph)",
                    b_ign,
                )
                bold_open = None

        # For each blockquote line, the text of the following lines of the same blockquote
        quote_tail: Dict[int, str] = {}
        tail_acc = ""
        for idx in range(len(lines) - 1, -1, -1):
            if lines[idx].lstrip().startswith(">"):
                quote_tail[idx + 1] = tail_acc
                tail_acc = lines[idx] + "\n" + tail_acc
            else:
                tail_acc = ""

        for line_no, raw in enumerate(lines, 1):
            # Fenced code blocks (ignored while inside an HTML comment)
            if not in_html_comment and FENCE_RE.match(raw):
                _flush_bold()
                in_fence = not in_fence
                in_callout = False
                if all_stack:
                    all_stack[-1].total_own_lines += 1
                pending_ignore.clear()
                continue
            if in_fence:
                if all_stack:
                    all_stack[-1].total_own_lines += 1
                continue

            # Extract lint-ignore comments and strip HTML comments (preserving inline backticks)
            prev_in_comment = in_html_comment
            unreasoned: Set[str] = set()
            clean_line, line_ignores, in_html_comment, had_comment = (
                strip_line_comments_and_ignores(raw, in_html_comment, unreasoned)
            )
            for rule in sorted(unreasoned):
                self.emit(
                    "WARN",
                    "lint-ignore-reason",
                    path,
                    line_no,
                    f"'lint-ignore: {rule}' needs a reason ('<!-- lint-ignore: {rule} — why -->'); suppression not applied",
                )
            if not prev_in_comment and in_html_comment:
                comment_open_line = line_no
            elif not in_html_comment:
                comment_open_line = None

            trim = clean_line.strip()

            # Pure comment line, blank line, or empty blockquote comment (`> <!-- ... -->`)
            if not trim and not had_comment:
                _flush_bold()
            if not trim or (trim == ">" and had_comment):
                if not trim and not (had_comment and raw.lstrip().startswith(">")):
                    in_callout = False
                if line_ignores:
                    pending_ignore |= line_ignores
                elif not raw.strip():
                    pending_ignore.clear()
                if all_stack and not all_stack[-1].awaiting_summary:
                    all_stack[-1].total_own_lines += 1
                continue

            kind = block_kind(trim)
            if bold_open is not None and not (kind == bold_open[2] and kind in ("para", "quote")):
                _flush_bold()

            # Track prose callout blockquotes starting with `> **...[:?.]**`
            if trim.startswith(">"):
                if CALLOUT_START_RE.match(trim):
                    in_callout = True
            else:
                in_callout = False

            active_ignore = pending_ignore | line_ignores
            pending_ignore = set()

            # Track section heading (e.g. `## 1.2 ...`)
            sec_m = SECTION_HEADING_RE.match(trim)
            if sec_m:
                current_section = (int(sec_m.group(1)), int(sec_m.group(2)))

            # Collect tut: links outside backticks on all non-fenced lines
            nocode_for_links = strip_code_placeholder(clean_line)
            for lm in TUT_LINK_RE.finditer(nocode_for_links):
                self.links.append(
                    LinkRef(
                        path=path,
                        line=line_no,
                        target_ch=lm.group(2),
                        anchor=lm.group(3) or "",
                        ignored=set(active_ignore),
                        label=lm.group(1),
                    )
                )

            # Check heading anchors
            hm = HEADING_ANCHOR_RE.match(trim)
            if hm:
                self.register_anchor(ch_key, hm.group(1), path, line_no, active_ignore)

            # Handle <details ...>
            dm = DETAILS_OPEN_RE.match(trim)
            if dm:
                if all_stack and all_stack[-1].awaiting_summary:
                    prev = all_stack[-1]
                    prev.awaiting_summary = False
                    self.emit(
                        "ERR",
                        "summary-missing",
                        path,
                        prev.start_line,
                        "<details> is missing a <summary>...</summary> line",
                        prev.ignored_rules,
                    )

                attrs = (dm.group(1) or "").strip()
                parent_all = all_stack[-1] if all_stack else None
                zoom_parent = zoom_stack[-1] if zoom_stack else None
                box = Box(
                    path=path,
                    chapter_key=ch_key,
                    start_line=line_no,
                    section=current_section,
                    parent_all=parent_all,
                    zoom_parent=zoom_parent,
                    ignored_rules=set(active_ignore),
                )
                if re.search(r"\bopen\b", attrs, re.IGNORECASE):
                    self.emit(
                        "ERR",
                        "details-open",
                        path,
                        line_no,
                        "<details open> is forbidden; boxes must start closed",
                        box.ignored_rules,
                    )
                extra_attrs = re.sub(r"\bopen\b", "", attrs, flags=re.IGNORECASE).strip()
                if extra_attrs:
                    self.emit(
                        "ERR",
                        "details-attr",
                        path,
                        line_no,
                        f"Unsupported <details> attribute(s) {extra_attrs!r}; put {{#id}} on <summary> instead",
                        box.ignored_rules,
                    )
                if parent_all is not None:
                    parent_all.children_all.append(box)
                else:
                    self.top_boxes.append(box)
                all_stack.append(box)
                self.boxes.append(box)
                continue

            # Handle </details>
            if DETAILS_CLOSE_RE.match(trim):
                pending_ignore.clear()
                if not all_stack:
                    self.emit(
                        "ERR",
                        "details-balance",
                        path,
                        line_no,
                        "Unmatched </details>",
                        active_ignore,
                    )
                    continue
                box = all_stack.pop()
                if box.awaiting_summary:
                    box.awaiting_summary = False
                    self.emit(
                        "ERR",
                        "summary-missing",
                        path,
                        box.start_line,
                        "<details> is missing a <summary>...</summary> line",
                        box.ignored_rules,
                    )
                box.end_line = line_no
                if zoom_stack and zoom_stack[-1] is box:
                    zoom_stack.pop()
                continue

            # Handle <summary>...</summary> when expected right after <details>
            if all_stack and all_stack[-1].awaiting_summary:
                box = all_stack[-1]
                box.awaiting_summary = False
                sm = SUMMARY_LINE_RE.match(trim)
                if sm:
                    box.summary_line = line_no
                    box.ignored_rules |= active_ignore
                    raw_sum = sm.group(1).strip()
                    am = ANCHOR_SUFFIX_RE.search(raw_sum)
                    if am:
                        box.anchor = am.group(1)
                        self.register_anchor(
                            ch_key,
                            box.anchor,
                            path,
                            line_no,
                            box.ignored_rules,
                        )
                        sum_text = raw_sum[: am.start()].strip()
                    else:
                        sum_text = raw_sum

                    if AUX_SUMMARY_RE.match(sum_text):
                        box.is_aux = True
                        box.level = None
                        box.title = sum_text
                    else:
                        fm = SUMMARY_FMT_RE.match(sum_text)
                        if not fm:
                            box.title = sum_text
                            self.emit(
                                "ERR",
                                "summary-format",
                                path,
                                line_no,
                                f"Invalid summary format {sum_text!r}; expected 'Level N · Label: Title'",
                                box.ignored_rules,
                            )
                        else:
                            box.level = int(fm.group(1))
                            box.label = fm.group(2).strip()
                            box.title = fm.group(3).strip()
                            if box.anchor:
                                self.box_titles[(ch_key, box.anchor)] = box.title
                            if LEVEL_REF_RE.search(box.title):
                                self.emit(
                                    "ERR",
                                    "level-ref",
                                    path,
                                    line_no,
                                    "Box title references 'Level N'; name the box it points to instead",
                                    box.ignored_rules,
                                )
                            allowed = SCHEMES[self.cfg.scheme][box.level]
                            if box.label not in allowed:
                                self.emit(
                                    "WARN",
                                    "label-name",
                                    path,
                                    line_no,
                                    f"Level {box.level} label {box.label!r} not in {self.cfg.scheme} scheme ({sorted(allowed)})",
                                    box.ignored_rules,
                                )
                            # Attach to zoom hierarchy now that we know it's a non-aux box
                            if box.zoom_parent is not None:
                                box.zoom_parent.zoom_children.append(box)
                            zoom_stack.append(box)

                    # Still run inline checks (bold/tag/backtick) on the summary line
                    self.check_line_inline(
                        path, line_no, clean_line, box.ignored_rules, is_summary=True
                    )
                    continue
                else:
                    self.emit(
                        "ERR",
                        "summary-missing",
                        path,
                        box.start_line,
                        "<details> is missing a <summary>...</summary> line",
                        box.ignored_rules,
                    )
                    # Fall through to process current line normally as body line

            # Record body line in innermost open box
            in_l2 = False
            if all_stack:
                cur_box = all_stack[-1]
                cur_box.own_lines.append((line_no, clean_line, set(active_ignore), in_callout))
                cur_box.total_own_lines += 1
                in_l2 = (not cur_box.is_aux) and (cur_box.level == 2)

            # Per-line inline checks
            odd_bold = self.check_line_inline(
                path,
                line_no,
                clean_line,
                active_ignore,
                in_l2=in_l2,
                in_callout=in_callout,
                defer_bold=True,
                eq_context=quote_tail.get(line_no, ""),
            )
            if odd_bold:
                if bold_open is not None:
                    bold_open = None  # closes the bold opened on an earlier line
                elif kind in ("para", "quote"):
                    bold_open = (line_no, set(active_ignore), kind)
                else:
                    self.emit(
                        "ERR",
                        "bold-balance",
                        path,
                        line_no,
                        "Unbalanced ** bold markers on line (bold cannot continue past a list item, heading or table row)",
                        active_ignore,
                    )
        _flush_bold()

        # Unclosed HTML comment at EOF
        if in_html_comment:
            self.emit(
                "ERR",
                "comment-balance",
                path,
                comment_open_line or len(lines),
                f"Unclosed HTML comment '<!--' opened at line {comment_open_line or len(lines)}",
            )

        # Any unclosed <details> at EOF
        while all_stack:
            box = all_stack.pop()
            if box.awaiting_summary:
                self.emit(
                    "ERR",
                    "summary-missing",
                    path,
                    box.start_line,
                    "<details> is missing a <summary>...</summary> line",
                    box.ignored_rules,
                )
            self.emit(
                "ERR",
                "details-balance",
                path,
                box.start_line,
                f"Unclosed <details> opened at line {box.start_line}",
                box.ignored_rules,
            )

    def check_boxes(self) -> None:
        seen_titles: Dict[Tuple[str, str], Tuple[str, int]] = {}

        for b in self.boxes:
            if b.is_aux or b.level is None:
                continue

            # Per-chapter duplicate title check
            norm_title = b.title.strip().lower()
            if norm_title:
                tkey = (b.chapter_key, norm_title)
                if tkey in seen_titles:
                    p_path, p_line = seen_titles[tkey]
                    self.emit(
                        "WARN",
                        "dup-title",
                        b.path,
                        b.summary_line or b.start_line,
                        f"Duplicate box title {b.title!r} in chapter {b.chapter_key} (first seen at {p_path}:{p_line})",
                        b.ignored_rules,
                    )
                else:
                    seen_titles[tkey] = (b.path, b.summary_line or b.start_line)

            # Hierarchy / nesting checks
            zp = b.zoom_parent
            if b.level == 1 and zp is not None:
                self.emit(
                    "ERR",
                    "nest-parent",
                    b.path,
                    b.summary_line or b.start_line,
                    f"Level 1 box must not be nested inside Level {zp.level} box ({zp.title!r})",
                    b.ignored_rules,
                )
            elif b.level == 2 and (zp is None or zp.level != 1):
                parent_desc = f"Level {zp.level}" if zp is not None else "top level"
                self.emit(
                    "ERR",
                    "nest-parent",
                    b.path,
                    b.summary_line or b.start_line,
                    f"Level 2 box is at {parent_desc} rather than directly inside a Level 1 box",
                    b.ignored_rules,
                )
            elif b.level == 3 and (zp is None or zp.level != 2):
                parent_desc = f"Level {zp.level}" if zp is not None else "top level"
                self.emit(
                    "ERR",
                    "nest-parent",
                    b.path,
                    b.summary_line or b.start_line,
                    f"Level 3 box must be directly inside a Level 2 box (found under {parent_desc})",
                    b.ignored_rules,
                )

            # Tier-specific content rules
            if b.level == 1:
                self._check_l1(b)
            elif b.level == 2:
                self._check_l2(b)
            elif b.level == 3:
                self._check_l3(b)

    def _check_l1(self, b: Box) -> None:
        equals_count = 0
        for ln, text, line_ign, in_callout in b.own_lines:
            eff_ign = b.ignored_rules | line_ign
            nocode = strip_code_placeholder(text)
            no_urls = MD_LINK_URL_RE.sub(r"\1", nocode)
            no_stars = no_urls.replace("*", "")
            exp_hit = find_l1_complex_exp(no_stars)
            if exp_hit:
                self.emit(
                    "ERR",
                    "l1-algebra",
                    b.path,
                    ln,
                    f"Level 1 Picture box contains complex exponential {exp_hit!r}",
                    eff_ign,
                )
            else:
                no_tags = re.sub(r"<[^>]+>", "", no_stars)
                m_forb = L1_FORBIDDEN_RE.search(no_tags)
                if m_forb:
                    self.emit(
                        "ERR",
                        "l1-algebra",
                        b.path,
                        ln,
                        f"Level 1 Picture box contains algebra/calculus token {m_forb.group(0)!r}",
                        eff_ign,
                    )
                elif STEP_RE.search(no_tags):
                    self.emit(
                        "ERR",
                        "l1-algebra",
                        b.path,
                        ln,
                        "Level 1 Picture box contains step-by-step derivation ('Step N')",
                        eff_ign,
                    )

            # Count '=' signs outside prose callouts, tags, link URLs, inline code, and benign state labels
            if not in_callout:
                eq_text = re.sub(
                    r"<sub\b[^>]*>([^<]*)</sub>", r"_\1", no_stars, flags=re.IGNORECASE
                )
                eq_text = re.sub(r"<[^>]+>", "", eq_text)
                eq_text = L1_LABEL_EQ_RE.sub("", eq_text)
                equals_count += eq_text.count("=")

        n_eq = len(b.eqs())
        if n_eq > 0 or equals_count > self.cfg.max_l1_equals:
            self.emit(
                "WARN",
                "l1-equations",
                b.path,
                b.summary_line or b.start_line,
                f"Level 1 box has {n_eq} displayed equation(s) and {equals_count} '=' signs (max 0 displayed, {self.cfg.max_l1_equals} inline)",
                b.ignored_rules,
            )

    def _check_l2(self, b: Box) -> None:
        eqs = b.eqs()
        if self.cfg.min_l2_eq and len(eqs) < self.cfg.min_l2_eq:
            self.emit(
                "WARN",
                "l2-size",
                b.path,
                b.summary_line or b.start_line,
                f"Level 2 box has {len(eqs)} display equations (min {self.cfg.min_l2_eq})",
                b.ignored_rules,
            )
        if len(eqs) > self.cfg.max_l2_eq:
            self.emit(
                "WARN",
                "l2-size",
                b.path,
                b.summary_line or b.start_line,
                f"Level 2 box has {len(eqs)} display equations (max {self.cfg.max_l2_eq})",
                b.ignored_rules,
            )

        own_text = "\n".join(text for _, text, _, _ in b.own_lines)
        own_nocode = "\n".join(strip_code_placeholder(text) for _, text, _, _ in b.own_lines)
        has_steps = bool(STEP_RE.search(own_nocode))
        if has_steps:
            self.emit(
                "WARN",
                "l2-size",
                b.path,
                b.summary_line or b.start_line,
                "Level 2 box contains step-by-step derivation ('Step N'); move detailed algebra into a Level 3 box",
                b.ignored_rules,
            )

        l3_children = [c for c in b.zoom_children if c.level == 3]
        has_l3 = len(l3_children) > 0

        if has_l3:
            has_phrase = bool(L2_POINTER_PHRASE_RE.search(own_text))
            child_anchors = {c.anchor for c in l3_children if c.anchor}
            cur_ch = (
                b.chapter_key
                if len(b.chapter_key) == 2 and b.chapter_key.isdigit()
                else None
            )
            has_child_link = False
            if child_anchors:
                for lm in TUT_LINK_RE.finditer(own_nocode):
                    target_ch, anc = lm.group(2), lm.group(3) or ""
                    if anc in child_anchors and (cur_ch is None or target_ch == cur_ch):
                        has_child_link = True
                        break
            if self.cfg.scheme == "new":
                # New scheme: "Full algebra: [Title](tut:NN#child-anchor)" is required.
                has_pointer = False
                for pm in FULL_ALGEBRA_LINK_RE.finditer(own_nocode):
                    if pm.group(2) in child_anchors and (cur_ch is None or pm.group(1) == cur_ch):
                        has_pointer = True
                        break
                if not child_anchors:
                    msg = "Level 2 box's child Level 3 box has no {#anchor}, so it cannot be linked; add one and end the Level 2 with 'Full algebra: [Title](tut:NN#anchor)'"
                else:
                    msg = "Level 2 box with a child Level 3 must point to it with 'Full algebra: [Level 3 title](tut:NN#anchor)'"
                if not has_pointer:
                    self.emit(
                        "WARN",
                        "l2-pointer",
                        b.path,
                        b.summary_line or b.start_line,
                        msg,
                        b.ignored_rules,
                    )
            elif not (has_phrase or has_child_link):
                self.emit(
                    "WARN",
                    "l2-pointer",
                    b.path,
                    b.summary_line or b.start_line,
                    "Level 2 box has a child Level 3 box but neither mentions 'full algebra'/'full derivation'/'step-by-step derivation' nor links to a child Level 3 anchor",
                    b.ignored_rules,
                )
        else:
            if len(eqs) > 4 or has_steps:
                self.emit(
                    "WARN",
                    "l2-pointer",
                    b.path,
                    b.summary_line or b.start_line,
                    f"Standalone Level 2 box looks long ({len(eqs)} display eqs / multi-step) with no child Level 3 box",
                    b.ignored_rules,
                )

    def _check_l3(self, b: Box) -> None:
        # 1. l3-youneed: first non-blank, non-comment own line
        first_line = b.own_lines[0][1] if b.own_lines else ""
        first_ign = b.own_lines[0][2] if b.own_lines else set()
        if not YOUNEED_RE.match(first_line):
            sev = "ERR" if self.cfg.scheme == "new" else "WARN"
            self.emit(
                sev,
                "l3-youneed",
                b.path,
                b.summary_line or b.start_line,
                "Level 3 box must begin with '**You need:**' (or 'You need:')",
                b.ignored_rules | first_ign,
            )

        own_text = "\n".join(text for _, text, _, _ in b.own_lines)

        # 2. l3-check: sanity check / verification (new scheme only; legacy
        #    Toolkit/Advanced boxes were never meant to end in a check)
        if self.cfg.scheme == "new" and not CHECK_RE.search(own_text):
            self.emit(
                "WARN",
                "l3-check",
                b.path,
                b.summary_line or b.start_line,
                "Level 3 box has no verification: add a '**Check:** ... ✓' paragraph",
                b.ignored_rules,
            )

        # 3. l3-forward: forward deferral, same-chapter forward §X.Y, or forward chapter ref (Ch 8 exempt from Ch 9)
        cur_num = chapter_num_for(b.path)
        for ln, text, line_ign, _ in b.own_lines:
            eff_ign = b.ignored_rules | line_ign
            nocode = strip_code_placeholder(text)
            m_def = FORWARD_DEFER_RE.search(nocode)
            if m_def:
                if self.emit(
                    "WARN",
                    "l3-forward",
                    b.path,
                    ln,
                    f"Level 3 derivation defers proof forward ({m_def.group(0)!r})",
                    eff_ign,
                ):
                    break
                continue
            m_below = FWD_BELOW_RE.search(nocode)
            if m_below:
                if self.emit(
                    "WARN",
                    "l3-forward",
                    b.path,
                    ln,
                    f"Level 3 derivation points forward to later material ({m_below.group(0)!r})",
                    eff_ign,
                ):
                    break
                continue
            fwd_anchor: Optional[str] = None
            for lm in TUT_LINK_RE.finditer(nocode):
                if lm.group(2) != b.chapter_key or not lm.group(3):
                    continue
                loc = self.anchors_by_ch.get(b.chapter_key, {}).get(lm.group(3))
                if loc and loc[0] == b.path and loc[1] > (b.end_line or b.start_line):
                    fwd_anchor = lm.group(3)
                    break
            if fwd_anchor is not None:
                if self.emit(
                    "WARN",
                    "l3-forward",
                    b.path,
                    ln,
                    f"Level 3 derivation links forward to #{fwd_anchor}, defined later in this chapter",
                    eff_ign,
                ):
                    break
                continue
            if b.section is not None:
                fwd_sec: Optional[str] = None
                for sm in SECTION_REF_RE.finditer(nocode):
                    s_ch, s_sub = int(sm.group(1)), int(sm.group(2))
                    if s_ch == b.section[0] and s_sub > b.section[1]:
                        fwd_sec = f"§{s_ch}.{s_sub}"
                        break
                if fwd_sec is not None:
                    if self.emit(
                        "WARN",
                        "l3-forward",
                        b.path,
                        ln,
                        f"Level 3 derivation in §{b.section[0]}.{b.section[1]} references later section {fwd_sec}",
                        eff_ign,
                    ):
                        break
                    continue
            if cur_num is not None and cur_num != 8:
                fwd_ch: Optional[int] = None
                for lm in TUT_LINK_RE.finditer(nocode):
                    tgt = int(lm.group(2))
                    if tgt > cur_num and tgt != 8:
                        fwd_ch = tgt
                        break
                if fwd_ch is None:
                    for cm in CHAPTER_MENTION_RE.finditer(nocode):
                        tgt = int(cm.group(1))
                        if tgt > cur_num and tgt != 8:
                            fwd_ch = tgt
                            break
                if fwd_ch is not None:
                    if self.emit(
                        "WARN",
                        "l3-forward",
                        b.path,
                        ln,
                        f"Level 3 derivation references later Chapter {fwd_ch} from Chapter {cur_num}",
                        eff_ign,
                    ):
                        break

    def resolve_refs(self) -> None:
        sibling_cache: Dict[Path, Set[str]] = {}

        def _siblings_for(dir_path: Path) -> Set[str]:
            if dir_path not in sibling_cache:
                found: Set[str] = set()
                if dir_path.is_dir():
                    for p in dir_path.glob("*.md"):
                        if len(p.name) >= 3 and p.name[:2].isdigit() and p.name[2] == "-":
                            found.add(p.name[:2])
                sibling_cache[dir_path] = found
            return sibling_cache[dir_path]

        def _norm_title(t: str) -> str:
            t = re.sub(r"<[^>]+>", "", t)
            t = re.sub(r"[*\\_^`]", "", t)
            return re.sub(r"\s+", " ", t).strip().lower()

        for ref in self.links:
            if ref.target_ch in self.passed_chapters:
                if ref.anchor:
                    title = self.box_titles.get((ref.target_ch, ref.anchor))
                    if title is not None:
                        lab, tit = _norm_title(ref.label), _norm_title(title)
                        if lab and lab != tit and lab not in tit:
                            self.emit(
                                "WARN",
                                "box-link-label",
                                ref.path,
                                ref.line,
                                f"Link label {ref.label!r} does not match the target box title {title!r}",
                                ref.ignored,
                            )
                    ch_anchors = self.anchors_by_ch.get(ref.target_ch, {})
                    if ref.anchor not in ch_anchors:
                        self.emit(
                            "ERR",
                            "box-ref",
                            ref.path,
                            ref.line,
                            f"Broken tutorial anchor tut:{ref.target_ch}#{ref.anchor}",
                            ref.ignored,
                        )
            else:
                sibs = _siblings_for(Path(ref.path).parent)
                if ref.target_ch in sibs:
                    continue
                if len(self.passed_chapters) >= 2 or len(sibs) >= 2:
                    self.emit(
                        "ERR",
                        "box-ref",
                        ref.path,
                        ref.line,
                        f"Link references nonexistent tutorial chapter tut:{ref.target_ch}",
                        ref.ignored,
                    )
                else:
                    tgt_num = int(ref.target_ch)
                    if tgt_num < 1 or tgt_num > 9:
                        self.emit(
                            "ERR",
                            "box-ref",
                            ref.path,
                            ref.line,
                            f"Link references nonexistent tutorial chapter tut:{ref.target_ch}",
                            ref.ignored,
                        )

    def print_outline(self) -> None:
        def _walk(box: Box, depth: int) -> None:
            indent = "  " * depth
            if box.is_aux:
                tag = "AUX"
            elif box.level is not None:
                tag = f"L{box.level} "
            else:
                tag = "L? "
            anc = f" {{#{box.anchor}}}" if box.anchor else ""
            label_part = f"{box.label}: " if box.label else ""
            print(
                f"{indent}{tag} {box.path}:{box.start_line}{anc}  "
                f"{label_part}{box.title}  "
                f"[eq:{len(box.eqs())} lines:{box.total_own_lines}]"
            )
            for child in box.children_all:
                _walk(child, depth + 1)

        for b in self.top_boxes:
            _walk(b, 0)


def build_arg_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(
        description="Lint tutorial markdown zoom boxes (Level 1 / 2 / 3) and formatting conventions."
    )
    ap.add_argument("files", nargs="+", help="Markdown files to lint")
    ap.add_argument(
        "--scheme",
        choices=["new", "legacy"],
        default="new",
        help="Box label scheme (default: new)",
    )
    ap.add_argument(
        "--strict",
        action="store_true",
        help="Treat warnings as errors (exit code 1)",
    )
    ap.add_argument(
        "--outline",
        action="store_true",
        help="Print box outline tree and exit 0",
    )
    ap.add_argument(
        "--ignore",
        default="",
        help="Comma-separated list of rule names to ignore",
    )
    ap.add_argument(
        "--max-l2-eq",
        type=int,
        default=5,
        help="Max display equations in a Level 2 box (default: 5)",
    )
    ap.add_argument(
        "--min-l2-eq",
        type=int,
        default=0,
        help="Min display equations in a Level 2 box (default: 0 = off; the style guide asks for 3-5)",
    )
    ap.add_argument(
        "--require-units",
        action="store_true",
        help="Warn on every display equation without an (SI) or (a.u.) tag, not only ones with SI constants",
    )
    ap.add_argument(
        "--max-l1-equals",
        type=int,
        default=2,
        help="Max '=' signs in a Level 1 box (default: 2)",
    )
    ap.add_argument(
        "--vectors",
        default=DEFAULT_VECTORS,
        help=f"Comma-separated single-letter vector symbols allowed in bold (default: {DEFAULT_VECTORS})",
    )
    return ap


def main(argv: Optional[List[str]] = None) -> int:
    ap = build_arg_parser()
    args = ap.parse_args(argv)

    ignore_set = {
        tok.strip().lower()
        for tok in args.ignore.split(",")
        if tok.strip()
    }
    vectors_set = {
        tok.strip()
        for tok in args.vectors.split(",")
        if tok.strip()
    }

    cfg = Config(
        scheme=args.scheme,
        strict=args.strict,
        outline=args.outline,
        ignore=ignore_set,
        max_l2_eq=args.max_l2_eq,
        min_l2_eq=args.min_l2_eq,
        max_l1_equals=args.max_l1_equals,
        require_units=args.require_units,
        vectors=vectors_set,
    )

    linter = Linter(cfg)
    for f in args.files:
        linter.lint_file(f)

    if cfg.outline:
        linter.print_outline()
        return 0

    linter.check_boxes()
    linter.resolve_refs()

    # Sort diagnostics by file, line, severity (ERR before WARN)
    linter.diags.sort(key=lambda d: (d.path, d.line, 0 if d.severity == "ERR" else 1, d.rule))

    errs = 0
    warns = 0
    by_rule: Counter[str] = Counter()
    for d in linter.diags:
        if d.severity == "ERR":
            errs += 1
        else:
            warns += 1
        by_rule[f"{d.severity}:{d.rule}"] += 1
        print(f"{d.severity:4s} [{d.rule}] {d.path}:{d.line}  {d.message}")

    summary = f"Summary: {errs} error(s), {warns} warning(s) across {len(args.files)} file(s)"
    if by_rule:
        breakdown = ", ".join(f"{k}={v}" for k, v in by_rule.most_common())
        summary += f" ({breakdown})"
    print(summary)

    if errs > 0 or (cfg.strict and warns > 0):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
