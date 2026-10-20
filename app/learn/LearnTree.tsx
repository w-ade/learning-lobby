"use client";

import { useMemo, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useFluidHover, type FluidHover } from "../tree/_glide/lib/useFluidHover";
import { HighlightSpring } from "../tree/_glide/components/HighlightSpring";
import hierarchy from "./guide-tree.json";
import styles from "./learn.module.css";

type Node = { id: string; label: string; number?: string; children?: Node[] };
const defaultDomains = hierarchy as Node[];

function Glyph({ kind }: { kind: "folder" | "open" | "file" | "down" | "right" }) {
  if (kind === "down") return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>;
  if (kind === "right") return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>;
  // Folder, open folder and file: 24px icons, stroked by .icon svg in the CSS.
  if (kind === "file") return <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.1716 3H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V9.82843C19 9.29799 18.7893 8.78929 18.4142 8.41421L13.5858 3.58579C13.2107 3.21071 12.702 3 12.1716 3Z" />
    <path d="M13 3.5V7C13 8.10457 13.8954 9 15 9H18.5" />
  </svg>;
  if (kind === "open") return <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 4H8.39445C9.39751 4 10.3342 4.5013 10.8906 5.3359L11.4063 6.1094C11.7772 6.6658 12.4017 7 13.0704 7H18C19.1046 7 20 7.89543 20 9V11H20.6398C21.3144 11 21.7955 11.6543 21.5943 12.2983L19.9386 17.5965C19.6777 18.4315 18.9044 19 18.0296 19H4.44076C3.64505 19 3 18.3549 3 17.5592V7C3 5.34315 4.34315 4 6 4Z" />
    <path d="M4.44141 19C5.07157 19 5.62862 18.5905 5.81659 17.989L7.56207 12.4034C7.82299 11.5685 8.59625 11 9.47102 11H20.0006" />
  </svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 7V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V10C21 8.34315 19.6569 7 18 7H13.0704C12.4017 7 11.7772 6.6658 11.4063 6.1094L10.5937 4.8906C10.2228 4.3342 9.59834 4 8.92963 4H6C4.34315 4 3 5.34315 3 7Z" />
  </svg>;
}

type Glide = {
  hover: FluidHover;
  // Each visible row's position in the list, for the fluid hover.
  // Rows that are animating out aren't in it, so they're never lit.
  indexOf: Map<string, number>;
};

function TreeNode({ node, level, expanded, toggle, onKeyDown, glide }: {
  node: Node;
  level: number;
  expanded: Set<string>;
  toggle: (node: Node) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, node: Node, level: number) => void;
  glide: Glide;
}) {
  const reduceMotion = useReducedMotion();
  const branch = Boolean(node.children?.length);
  const open = expanded.has(node.id);
  const label = node.number ? `${node.number} ${node.label}` : node.label;
  const index = glide.indexOf.get(node.id);
  return <div className={styles.node} role="none">
    <button
      ref={index === undefined ? undefined : glide.hover.itemRef(index)}
      onFocus={(event) => {
        // Light the row for keyboard focus only, like /tree.
        if (index !== undefined && event.currentTarget.matches(":focus-visible")) glide.hover.setActiveIndex(index);
      }}
      className={`${styles.row} ${level === 1 ? styles.domain : ""}`}
      type="button"
      role="treeitem"
      aria-level={level}
      aria-expanded={branch ? open : undefined}
      tabIndex={level === 1 ? 0 : -1}
      data-learn-row
      onClick={() => branch && toggle(node)}
      onKeyDown={(event) => onKeyDown(event, node, level)}
      style={{ paddingLeft: `${8 + (level - 1) * 21}px` }}
    >
      <span className={styles.chevron}>{branch && <Glyph kind={open ? "down" : "right"} />}</span>
      <span className={styles.icon}><Glyph kind={branch ? (open ? "open" : "folder") : "file"} /></span>
      <span className={styles.label}>{label}</span>
    </button>
    {branch && <AnimatePresence initial={false}>
      {open && <motion.div
        className={styles.children}
        role="group"
        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 38 }}
      >
        {node.children!.map((child) => <TreeNode key={child.id} node={child} level={level + 1} expanded={expanded} toggle={toggle} onKeyDown={onKeyDown} glide={glide} />)}
      </motion.div>}
    </AnimatePresence>}
  </div>;
}

function visibleOrder(nodes: Node[], expanded: Set<string>, out = new Map<string, number>()) {
  for (const node of nodes) {
    out.set(node.id, out.size);
    if (node.children?.length && expanded.has(node.id)) visibleOrder(node.children, expanded, out);
  }
  return out;
}

export default function LearnTree({ data }: { data?: Node[] } = {}) {
  const domains = data ?? defaultDomains;
  const [expanded, setExpanded] = useState(() => new Set<string>());
  const treeRef = useRef<HTMLDivElement>(null);
  const hover = useFluidHover(treeRef);
  const indexOf = useMemo(() => visibleOrder(domains, expanded), [expanded]);
  const glide = { hover, indexOf };
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!treeRef.current?.contains(event.relatedTarget as Element | null)) hover.setActiveIndex(null);
  };
  const toggle = (node: Node) => setExpanded((current) => {
    const next = new Set(current);
    if (next.has(node.id)) next.delete(node.id); else next.add(node.id);
    return next;
  });
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, node: Node, level: number) => {
    const rows = Array.from((treeRef.current ?? document).querySelectorAll<HTMLButtonElement>("[data-learn-row]"));
    const index = rows.indexOf(event.currentTarget);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      rows[index + (event.key === "ArrowDown" ? 1 : -1)]?.focus();
    } else if (event.key === "ArrowRight" && node.children?.length) {
      event.preventDefault();
      if (!expanded.has(node.id)) toggle(node); else rows[index + 1]?.focus();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (node.children?.length && expanded.has(node.id)) toggle(node);
      else if (level > 1) rows.slice(0, index).reverse().find((row) => row.getAttribute("aria-level") === String(level - 1))?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      (event.key === "Home" ? rows[0] : rows.at(-1))?.focus();
    } else if ((event.key === "Enter" || event.key === " ") && node.children?.length) {
      event.preventDefault(); toggle(node);
    }
  };
  // Same page shell as /tree: .glide and its classes come from ../tree/glide.css.
  return <div className="glide">
    <main>
      <div
        ref={treeRef}
        className={styles.tree}
        role="tree"
        aria-label="Weblab guide hierarchy"
        data-engine="spring"
        onBlur={onBlur}
        {...hover.handlers}
      >
        <HighlightSpring hover={hover} />
        {domains.map((node) => <TreeNode key={node.id} node={node} level={1} expanded={expanded} toggle={toggle} onKeyDown={onKeyDown} glide={glide} />)}
      </div>
    </main>
  </div>;
}
