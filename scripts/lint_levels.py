#!/usr/bin/env python3
"""Linter for multi-level zoom boxes and markdown conventions in tutorial/*.md."""

from __future__ import annotations

import argparse
import re
import sys
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

DEFAULT_VECTORS = "r,p,J,X,v,L,A,B,E,F,k,φ"

# Regex patterns
FENCE_RE = re.compile(r"^\s*```")
HTML_COMMENT_RE = re.compile(r"<!--.*?-->")
IGNORE_RE = re.compile(r"<!--\s*lint-ignore:\s*([\w\-, ]+?)\s*-->")
DETAILS_OPEN_RE = re.compile(r"^<details(?:\s+([^>]*))?>$", re.IGNORECASE)
DETAILS_CLOSE_RE = re.compile(r"^</details>$", re.IGNORECASE)
SUMMARY_LINE_RE = re.compile(r"^<summary>(.*)</summary>$", re.IGNORECASE)
ANCHOR_SUFFIX_RE = re.compile(r"\s*\{#([A-Za-z0-9_-]+)\}\s*$")
HEADING_ANCHOR_RE = re.compile(r"^#{1,4}\s+.*\{#([A-Za-z0-9_-]+)\}\s*$")
AUX_SUMMARY_RE = re.compile(
    r"^(?:answers?|app details:.*|.*\(app details\))$",
    re.IGNORECASE,
)
SUMMARY_FMT_RE = re.compile(r"^Level\s+([123])\s+·\s+([^:]+?):\s*(.+)$")
TUT_LINK_RE = re.compile(r"\[([^\]\n]+)\]\(tut:(\d{2})(?:#([A-Za-z0-9_-]+))?\)")

# Content & inline checks
L1_FORBIDDEN_RE = re.compile(r"[∇∂∫∑Ĥ]|\bd[A-Za-zψΨΦRPu]?/d[trφθx]\b")
STEP_RE = re.compile(r"\bStep\s+\d+\b", re.IGNORECASE)
LEVEL_REF_RE = re.compile(r"\bLevel\s*[123]\b", re.IGNORECASE)
YOUNEED_RE = re.compile(r"^\s*(?:\*\*You need:?\*\*|You need:)", re.IGNORECASE)
CHECK_RE = re.compile(r"✓|\b(?:check|verify|limiting case|sanity)\b", re.IGNORECASE)
FORWARD_DEFER_RE = re.compile(
    r"\b(?:proved|derived|shown)\s+later\b"
    r"|\bwe\s+(?:will|'ll)\s+(?:prove|derive|show)\b"
    r"|\bleft\s+(?:as\s+an\s+exercise|to\s+the\s+reader)\b"
    r"|\blater\s+chapter\b",
    re.IGNORECASE,
)
CHAPTER_MENTION_RE = re.compile(r"\b(?:Chapter|Ch\.)\s+(\d+)\b", re.IGNORECASE)
EQ_LINE_RE = re.compile(r"^\s*>\s*(?![-*]\s).*[=≈∝]")
SI_SYM_RE = re.compile(r"ħ|m<sub>e</sub>|mₑ|ε₀")
SI_TAG_RE = re.compile(r"\bSI\b")
CODE_SPAN_RE = re.compile(r"`[^`]*`")
BOLD_SPAN_RE = re.compile(r"\*\*([^\n]+?)\*\*")
SINGLE_LETTER_RE = re.compile(r"^[A-Za-zα-ωΑ-Ω]$")
MATH_CHARS_RE = re.compile(r"[=∇∂∫∑ĤψΨΦ±×÷√∞≈∝≤≥≠⟨⟩]|<sup>")
INLINE_TAG_RE = re.compile(r"<(/?)(sub|sup|summary)\b[^>]*>", re.IGNORECASE)


@dataclass
class Config:
    scheme: str = "new"
    strict: bool = False
    outline: bool = False
    ignore: Set[str] = field(default_factory=set)
    max_l2_eq: int = 5
    max_l1_equals: int = 2
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
    parent_all: Optional["Box"] = None
    zoom_parent: Optional["Box"] = None
    children_all: List["Box"] = field(default_factory=list)
    zoom_children: List["Box"] = field(default_factory=list)
    own_lines: List[Tuple[int, str, Set[str]]] = field(default_factory=list)
    total_own_lines: int = 0
    ignored_rules: Set[str] = field(default_factory=set)

    def eqs(self) -> List[Tuple[int, str]]:
        """Return display equation lines belonging directly to this box."""
        out: List[Tuple[int, str]] = []
        for ln, text, _ in self.own_lines:
            cleaned = re.sub(r"<[^>]+>", "", CODE_SPAN_RE.sub("CODE", text))
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


def parse_ignore_rules(raw: str) -> Set[str]:
    rules: Set[str] = set()
    for m in IGNORE_RE.finditer(raw):
        for tok in re.split(r"[,\s]+", m.group(1).strip()):
            if tok:
                rules.add(tok.lower())
    return rules


def strip_comments(raw: str) -> str:
    return HTML_COMMENT_RE.sub("", raw)


def strip_code_placeholder(s: str) -> str:
    return CODE_SPAN_RE.sub("CODE", s)


class Linter:
    def __init__(self, cfg: Config) -> None:
        self.cfg = cfg
        self.diags: List[Diagnostic] = []
        self.boxes: List[Box] = []
        self.top_boxes: List[Box] = []
        self.anchors_by_ch: Dict[str, Dict[str, Tuple[str, int]]] = {}
        self.links: List[LinkRef] = []
        self.passed_chapters: Set[str] = set()

    def emit(
        self,
        severity: str,
        rule: str,
        path: str,
        line: int,
        message: str,
        ignored: Optional[Set[str]] = None,
    ) -> None:
        r = rule.lower()
        if "all" in self.cfg.ignore or r in self.cfg.ignore:
            return
        if ignored and ("all" in ignored or r in ignored):
            return
        self.diags.append(Diagnostic(severity, rule, path, line, message))

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
    ) -> None:
        # 1. Backtick balance (ignore escaped \`)
        bt_line = clean_line.replace("\\`", "")
        if bt_line.count("`") % 2 != 0:
            self.emit(
                "WARN",
                "backtick-balance",
                path,
                line_no,
                "Odd number of backticks on line",
                ignored,
            )

        # Strip inline code spans using non-empty placeholder so **`code`** stays **CODE**
        nocode = strip_code_placeholder(clean_line)

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

        # 4. Units tag on SI display equations
        if (
            not is_summary
            and EQ_LINE_RE.match(re.sub(r"<[^>]+>", "", nocode))
            and SI_SYM_RE.search(nocode)
            and not SI_TAG_RE.search(nocode)
        ):
            self.emit(
                "WARN",
                "units-tag",
                path,
                line_no,
                "Display equation uses SI constants (ħ, m_e, ε₀) without an explicit (SI) tag",
                ignored,
            )

        # 5. Bold balance, bold-nested, bold-math
        no_esc = nocode.replace("\\*", "")
        stars_count = len(re.findall(r"\*\*", no_esc))
        if stars_count % 2 != 0:
            self.emit(
                "ERR",
                "bold-balance",
                path,
                line_no,
                "Unbalanced ** bold markers on line",
                ignored,
            )
            return

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
            if not inner:
                continue
            if SINGLE_LETTER_RE.match(inner):
                if inner not in self.cfg.vectors:
                    self.emit(
                        "WARN",
                        "bold-math",
                        path,
                        line_no,
                        f"Bold single non-vector letter '**{inner}**'; use '*{inner}*' for scalars or add to --vectors",
                        ignored,
                    )
            elif MATH_CHARS_RE.search(inner):
                self.emit(
                    "WARN",
                    "bold-math",
                    path,
                    line_no,
                    f"Math expression inside bold ('**{inner}**'); use italics for scalars and bold only for vectors/prose",
                    ignored,
                )

    def lint_file(self, path: str) -> None:
        text = Path(path).read_text(encoding="utf-8")
        lines = text.splitlines()
        ch_key = chapter_key_for(path)
        self.passed_chapters.add(ch_key)
        self.anchors_by_ch.setdefault(ch_key, {})

        all_stack: List[Box] = []
        zoom_stack: List[Box] = []
        in_fence = False
        pending_ignore: Set[str] = set()

        for line_no, raw in enumerate(lines, 1):
            # Fenced code blocks
            if FENCE_RE.match(raw):
                in_fence = not in_fence
                if all_stack:
                    all_stack[-1].total_own_lines += 1
                pending_ignore.clear()
                continue
            if in_fence:
                if all_stack:
                    all_stack[-1].total_own_lines += 1
                continue

            # Extract lint-ignore comments and strip HTML comments before checks
            line_ignores = parse_ignore_rules(raw)
            clean_line = strip_comments(raw)
            trim = clean_line.strip()

            # Pure comment line (or blank line)
            if not trim:
                if line_ignores:
                    pending_ignore |= line_ignores
                elif not raw.strip():
                    # Blank line resets pending single-line ignore
                    pending_ignore.clear()
                if all_stack and not all_stack[-1].awaiting_summary:
                    all_stack[-1].total_own_lines += 1
                continue

            active_ignore = pending_ignore | line_ignores
            pending_ignore = set()

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

                attrs = dm.group(1) or ""
                parent_all = all_stack[-1] if all_stack else None
                zoom_parent = zoom_stack[-1] if zoom_stack else None
                box = Box(
                    path=path,
                    chapter_key=ch_key,
                    start_line=line_no,
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
                if parent_all is not None:
                    parent_all.children_all.append(box)
                else:
                    self.top_boxes.append(box)
                all_stack.append(box)
                self.boxes.append(box)
                continue

            # Handle </details>
            if DETAILS_CLOSE_RE.match(trim):
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
            if all_stack:
                cur_box = all_stack[-1]
                cur_box.own_lines.append((line_no, clean_line, set(active_ignore)))
                cur_box.total_own_lines += 1

            # Per-line inline checks
            self.check_line_inline(path, line_no, clean_line, active_ignore)

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
        seen_titles: Dict[str, Tuple[str, int]] = {}

        for b in self.boxes:
            if b.is_aux or b.level is None:
                continue

            # Duplicate title check
            norm_title = b.title.strip().lower()
            if norm_title:
                if norm_title in seen_titles:
                    p_path, p_line = seen_titles[norm_title]
                    self.emit(
                        "WARN",
                        "dup-title",
                        b.path,
                        b.summary_line or b.start_line,
                        f"Duplicate box title {b.title!r} (first seen at {p_path}:{p_line})",
                        b.ignored_rules,
                    )
                else:
                    seen_titles[norm_title] = (b.path, b.summary_line or b.start_line)

            # Hierarchy / nesting checks (Fix 3)
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
                    "WARN",
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
        for ln, text, line_ign in b.own_lines:
            eff_ign = b.ignored_rules | line_ign
            nocode = strip_code_placeholder(text)
            no_stars = nocode.replace("*", "")
            m_forb = L1_FORBIDDEN_RE.search(no_stars)
            if m_forb:
                self.emit(
                    "ERR",
                    "l1-algebra",
                    b.path,
                    ln,
                    f"Level 1 Picture box contains algebra/calculus token {m_forb.group(0)!r}",
                    eff_ign,
                )
            elif STEP_RE.search(no_stars):
                self.emit(
                    "ERR",
                    "l1-algebra",
                    b.path,
                    ln,
                    "Level 1 Picture box contains step-by-step derivation ('Step N')",
                    eff_ign,
                )

            # Count '=' signs outside tags, links, and inline code
            no_links = re.sub(r"\[[^\]]*\]\([^)]*\)", "", nocode)
            no_tags = re.sub(r"<[^>]+>", "", no_links)
            equals_count += no_tags.count("=")

        if equals_count > self.cfg.max_l1_equals:
            self.emit(
                "WARN",
                "l1-equations",
                b.path,
                b.summary_line or b.start_line,
                f"Level 1 box has {equals_count} '=' signs (max {self.cfg.max_l1_equals})",
                b.ignored_rules,
            )

    def _check_l2(self, b: Box) -> None:
        eqs = b.eqs()
        if len(eqs) > self.cfg.max_l2_eq:
            self.emit(
                "WARN",
                "l2-size",
                b.path,
                b.summary_line or b.start_line,
                f"Level 2 box has {len(eqs)} display equations (max {self.cfg.max_l2_eq})",
                b.ignored_rules,
            )

        own_text = "\n".join(text for _, text, _ in b.own_lines)
        l3_children = [c for c in b.zoom_children if c.level == 3]
        has_l3 = len(l3_children) > 0

        if has_l3:
            has_phrase = "full algebra" in own_text.lower()
            child_anchors = {c.anchor for c in l3_children if c.anchor}
            cur_ch = b.chapter_key if len(b.chapter_key) == 2 and b.chapter_key.isdigit() else None
            has_child_link = False
            if child_anchors:
                for lm in TUT_LINK_RE.finditer(strip_code_placeholder(own_text)):
                    target_ch, anc = lm.group(2), lm.group(3) or ""
                    if anc in child_anchors and (cur_ch is None or target_ch == cur_ch):
                        has_child_link = True
                        break
            if not (has_phrase or has_child_link):
                self.emit(
                    "WARN",
                    "l2-pointer",
                    b.path,
                    b.summary_line or b.start_line,
                    "Level 2 box has a child Level 3 box but neither mentions 'full algebra' nor links to a child Level 3 anchor",
                    b.ignored_rules,
                )
        else:
            if len(eqs) > 4 or STEP_RE.search(own_text):
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
        if not YOUNEED_RE.match(first_line):
            sev = "ERR" if self.cfg.scheme == "new" else "WARN"
            self.emit(
                sev,
                "l3-youneed",
                b.path,
                b.summary_line or b.start_line,
                "Level 3 box must begin with '**You need:**' (or 'You need:')",
                b.ignored_rules,
            )

        own_text = "\n".join(text for _, text, _ in b.own_lines)

        # 2. l3-check: sanity check / verification
        if not CHECK_RE.search(own_text):
            self.emit(
                "WARN",
                "l3-check",
                b.path,
                b.summary_line or b.start_line,
                "Level 3 box has no verification/sanity check (e.g. '✓' or 'Check')",
                b.ignored_rules,
            )

        # 3. l3-forward: forward deferral or forward chapter reference (excluding Ch 8 Math Toolkit)
        cur_num = chapter_num_for(b.path)
        for ln, text, line_ign in b.own_lines:
            eff_ign = b.ignored_rules | line_ign
            nocode = strip_code_placeholder(text)
            m_def = FORWARD_DEFER_RE.search(nocode)
            if m_def:
                self.emit(
                    "WARN",
                    "l3-forward",
                    b.path,
                    ln,
                    f"Level 3 derivation defers proof forward ({m_def.group(0)!r})",
                    eff_ign,
                )
                break
            if cur_num is not None:
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
                    self.emit(
                        "WARN",
                        "l3-forward",
                        b.path,
                        ln,
                        f"Level 3 derivation references later Chapter {fwd_ch} from Chapter {cur_num}",
                        eff_ign,
                    )
                    break

    def resolve_refs(self) -> None:
        for ref in self.links:
            if ref.target_ch in self.passed_chapters and ref.anchor:
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
        max_l1_equals=args.max_l1_equals,
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
