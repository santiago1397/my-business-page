"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";

type CardType = "polaroid" | "code" | "todo" | "details" | "video";

interface CardSpec {
  type: CardType;
  // Settled (final) position as percentages of the viewport.
  left: string;   // e.g. "9%"
  top: string;    // e.g. "20%"
  // Settled 3D rotation
  rx: number;
  ry: number;
  rz: number;
  // Settled scale
  scale: number;
  // Size in px
  width: number;
  height: number;
  // Fold-into-folder timing
  foldStart: number;
  foldEnd: number;
  zIndex: number;
  // Payload
  src?: string;
  filename?: string;
  label?: string;
  code?: CodeLine[];
  items?: { text: string; done?: boolean }[];
  fields?: Array<{ label: string; value: string }>;
  title?: string;
  notes?: string;
}

interface CodeLine {
  text: string;
  color: "comment" | "keyword" | "fn" | "muted" | "tag" | "attr";
  indent?: number;
  tokens?: { text: string; color: CodeLine["color"] }[];
}

// Distance cards travel down to land in the folder during fold.
const FOLDER_TARGET_PX_Y = 220;

// Card fold window — wave across cards
const FOLD_BASE = 0.50;
const FOLD_STEP = 0.022;
const FOLD_DUR = 0.07;
const foldTime = (i: number) => FOLD_BASE + i * FOLD_STEP;

function Card({ spec, progress }: { spec: CardSpec; progress: MotionValue<number> }) {
  const { left, top, rx, ry, rz, scale, width, height, foldStart, foldEnd, zIndex } = spec;

  const ty = useTransform(progress, (p) => {
    if (p < foldStart) return 0;
    if (p >= foldEnd) return FOLDER_TARGET_PX_Y;
    const t = (p - foldStart) / (foldEnd - foldStart);
    return FOLDER_TARGET_PX_Y * (1 - Math.pow(1 - t, 3));
  });

  const sc = useTransform(progress, [foldStart, foldEnd], [scale, scale * 0.15]);
  const rotZ = useTransform(progress, [foldStart, foldEnd], [rz, rz + 180]);
  const opacity = useTransform(progress, [foldStart, (foldStart + foldEnd) / 2, foldEnd], [1, 0.6, 0]);
  // Pre-fold visibility — appear with the "Time to change that" reveal
  const enter = useTransform(progress, [0.42, 0.50], [0, 1]);
  const fullOpacity = useTransform<number, number>(
    [enter, opacity],
    ([e, o]) => Math.min(e, o)
  );

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left,
        top,
        zIndex,
        opacity: fullOpacity,
        y: ty,
        rotate: rotZ,
        scale: sc,
        translateX: "-50%",
        translateY: "-50%",
        willChange: "transform, opacity",
      }}
    >
      <div
        className="border border-neutral-700/60 bg-neutral-900 overflow-hidden rounded-sm p-1 shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
        style={{
          width,
          height,
          transform: `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <CardBody spec={spec} />
      </div>
    </motion.div>
  );
}

function CardBody({ spec }: { spec: CardSpec }) {
  switch (spec.type) {
    case "polaroid":
      return <PolaroidBody src={spec.src!} label={spec.label!} />;
    case "code":
      return <CodeBody filename={spec.filename!} code={spec.code!} />;
    case "todo":
      return <TodoBody items={spec.items!} />;
    case "details":
      return <DetailsBody title={spec.title!} fields={spec.fields!} notes={spec.notes} />;
    case "video":
      return <VideoBody src={spec.src!} label={spec.label!} />;
  }
}

function LabelOverlay({ text }: { text: string }) {
  return (
    <div className="absolute bottom-1 left-1 right-1 bg-black/55 backdrop-blur-sm px-1.5 py-0.5 rounded-xs">
      <span className="font-mono text-[8px] tracking-wider truncate block text-neutral-100">
        {text}
      </span>
    </div>
  );
}

function PolaroidBody({ src, label }: { src: string; label: string }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center relative overflow-hidden rounded-xs">
      <Image src={src} alt={label} fill sizes="220px" className="object-cover rounded-xs" />
      <LabelOverlay text={label} />
    </div>
  );
}

const tokenColor: Record<CodeLine["color"], string> = {
  comment: "text-pink-400",
  keyword: "text-fuchsia-400",
  fn: "text-cyan-400",
  muted: "text-neutral-400",
  tag: "text-pink-400",
  attr: "text-yellow-300",
};

function CodeBody({ filename, code }: { filename: string; code: CodeLine[] }) {
  return (
    <div className="w-full h-full bg-neutral-950 border border-neutral-800 p-3 font-mono text-[10px] leading-relaxed overflow-hidden rounded-xs">
      {code.map((line, i) => (
        <div key={i} className={`${tokenColor[line.color]}`} style={{ paddingLeft: (line.indent ?? 0) * 8 }}>
          {line.tokens ? (
            line.tokens.map((t, j) => (
              <span key={j} className={tokenColor[t.color]}>
                {t.text}
              </span>
            ))
          ) : (
            line.text
          )}
        </div>
      ))}
    </div>
  );
}

function TodoBody({ items }: { items: { text: string; done?: boolean }[] }) {
  return (
    <div className="w-full h-full bg-neutral-900 p-2.5 flex flex-col rounded-xs">
      <div className="font-mono text-[8px] font-medium text-neutral-100 mb-2">To-do:</div>
      <div className="flex-1 space-y-1.5 text-[7px] text-neutral-400">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 border border-neutral-500 ${it.done ? "bg-neutral-300/20" : ""}`} />
            <span className={it.done ? "line-through opacity-50" : ""}>{it.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailsBody({ title, fields, notes }: { title: string; fields: Array<{ label: string; value: string }>; notes?: string }) {
  return (
    <div className="w-full h-full bg-neutral-900 p-3 flex flex-col rounded-xs">
      <div className="font-mono text-[11px] font-medium text-neutral-100 mb-2">{title}</div>
      <div className="flex-1 space-y-1.5 text-[9px] text-neutral-400 leading-relaxed font-mono">
        {fields.map((f, i) => (
          <p key={i}>
            {f.label}: {f.value}
          </p>
        ))}
        {notes && (
          <p className="pt-1.5 border-t border-neutral-700/70 mt-1.5">Notes: {notes}</p>
        )}
      </div>
    </div>
  );
}

function VideoBody({ src, label }: { src: string; label: string }) {
  return (
    <div className="w-full h-full bg-neutral-950 flex items-center justify-center relative rounded-xs overflow-hidden">
      <Image src={src} alt={label} fill sizes="220px" className="object-cover" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-8 rounded-xs border border-white/40 bg-black/30 flex items-center justify-center backdrop-blur-sm">
          <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <LabelOverlay text={label} />
    </div>
  );
}

// 12 cards distributed around viewport edges — matches save.design's positioning.
const cards: CardSpec[] = [
  {
    type: "polaroid", src: "/images/magazin-cover.webp", label: "style-inspo.png",
    left: "9%", top: "20%", rx: 5, ry: 15, rz: -8, scale: 1.05,
    width: 130, height: 175, zIndex: 50,
    foldStart: foldTime(0), foldEnd: foldTime(0) + FOLD_DUR,
  },
  {
    type: "polaroid", src: "/images/dribble-shot.webp", label: "dribbble.com/shot",
    left: "20%", top: "18%", rx: 12, ry: 8, rz: -15, scale: 0.85,
    width: 190, height: 150, zIndex: 51,
    foldStart: foldTime(1), foldEnd: foldTime(1) + FOLD_DUR,
  },
  {
    type: "code", filename: "animation.tsx",
    code: [
      { color: "comment", text: "// animation.tsx" },
      { color: "keyword", text: "", tokens: [
        { color: "keyword", text: "export const " },
        { color: "fn", text: "Card" },
        { color: "keyword", text: " = () => {" },
      ] },
      { color: "muted", indent: 1, text: "return (" },
      { color: "tag", indent: 2, text: "<motion.div" },
      { color: "attr", indent: 3, text: "animate={{ y: 0 }}" },
      { color: "tag", indent: 2, text: "/>" },
      { color: "muted", indent: 1, text: ")" },
      { color: "keyword", text: "}" },
    ],
    left: "8%", top: "44%", rx: -8, ry: 20, rz: 5, scale: 1,
    width: 220, height: 160, zIndex: 52,
    foldStart: foldTime(2), foldEnd: foldTime(2) + FOLD_DUR,
  },
  {
    type: "polaroid", src: "/images/awward-website.webp", label: "awwwards.com/site",
    left: "82%", top: "24%", rx: 8, ry: -20, rz: 10, scale: 0.9,
    width: 190, height: 150, zIndex: 53,
    foldStart: foldTime(3), foldEnd: foldTime(3) + FOLD_DUR,
  },
  {
    type: "todo",
    items: [
      { text: "Fix hero animation" },
      { text: "Update colors", done: true },
      { text: "Review with team" },
      { text: "Ship by Friday" },
      { text: "Write docs" },
    ],
    left: "8%", top: "68%", rx: 5, ry: 8, rz: -5, scale: 0.9,
    width: 170, height: 210, zIndex: 54,
    foldStart: foldTime(4), foldEnd: foldTime(4) + FOLD_DUR,
  },
  {
    type: "video", src: "/images/screen-recording.webp", label: "product_trailer.mp4",
    left: "18%", top: "54%", rx: -5, ry: 25, rz: 8, scale: 0.95,
    width: 190, height: 150, zIndex: 55,
    foldStart: foldTime(5), foldEnd: foldTime(5) + FOLD_DUR,
  },
  {
    type: "polaroid", src: "/images/dithering-shader.webp", label: "lowpoly-terrain.glsl",
    left: "68%", top: "16%", rx: -3, ry: -8, rz: 5, scale: 0.95,
    width: 195, height: 115, zIndex: 56,
    foldStart: foldTime(6), foldEnd: foldTime(6) + FOLD_DUR,
  },
  {
    type: "details", title: "Project details:",
    fields: [
      { label: "Client", value: "Acme Corp" },
      { label: "Deadline", value: "Jan 15" },
      { label: "Stack", value: "Next.js, Three.js" },
    ],
    notes: "Need to finalize the shader effect...",
    left: "82%", top: "38%", rx: -3, ry: -5, rz: -2, scale: 1,
    width: 170, height: 210, zIndex: 57,
    foldStart: foldTime(7), foldEnd: foldTime(7) + FOLD_DUR,
  },
  {
    type: "polaroid", src: "/images/hero-mockup.webp", label: "hero_mockup.fig",
    left: "85%", top: "58%", rx: -10, ry: -15, rz: -6, scale: 1,
    width: 190, height: 150, zIndex: 58,
    foldStart: foldTime(8), foldEnd: foldTime(8) + FOLD_DUR,
  },
  {
    type: "code", filename: "shader.glsl",
    code: [
      { color: "comment", text: "// shader.glsl" },
      { color: "keyword", text: "", tokens: [
        { color: "keyword", text: "const " },
        { color: "fn", text: "render" },
        { color: "keyword", text: " = () => {" },
      ] },
      { color: "muted", indent: 1, text: "return <Canvas>" },
      { color: "tag", indent: 2, text: "<mesh />" },
      { color: "muted", indent: 1, text: "</Canvas>" },
      { color: "keyword", text: "}" },
    ],
    left: "72%", top: "65%", rx: 5, ry: -25, rz: 12, scale: 0.85,
    width: 220, height: 160, zIndex: 59,
    foldStart: foldTime(9), foldEnd: foldTime(9) + FOLD_DUR,
  },
  {
    type: "code", filename: "utils.ts",
    code: [
      { color: "comment", text: "// utils.ts" },
      { color: "keyword", text: "", tokens: [
        { color: "keyword", text: "const " },
        { color: "fn", text: "render" },
        { color: "keyword", text: " = () => {" },
      ] },
      { color: "muted", indent: 1, text: "return <Canvas>" },
      { color: "tag", indent: 2, text: "<mesh />" },
      { color: "muted", indent: 1, text: "</Canvas>" },
      { color: "keyword", text: "}" },
    ],
    left: "20%", top: "74%", rx: 8, ry: 12, rz: -10, scale: 0.75,
    width: 220, height: 160, zIndex: 60,
    foldStart: foldTime(10), foldEnd: foldTime(10) + FOLD_DUR,
  },
  {
    type: "video", src: "/images/remotion-video.webp", label: "remotion-intro.tsx",
    left: "65%", top: "75%", rx: -10, ry: -4, rz: 6, scale: 0.75,
    width: 190, height: 150, zIndex: 61,
    foldStart: foldTime(11), foldEnd: foldTime(11) + FOLD_DUR,
  },
];

interface FloatingCardsProps {
  progress: MotionValue<number>;
}

export function FloatingCards({ progress }: FloatingCardsProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* ASCII / pixel background pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] font-mono text-[12px] leading-6 tracking-[14px] text-white overflow-hidden select-none whitespace-pre pointer-events-none"
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i}>
            {".+.--..:*:".repeat(20).slice(i % 10)}
          </div>
        ))}
      </div>

      {cards.map((c, i) => (
        <Card key={i} spec={c} progress={progress} />
      ))}
    </div>
  );
}
