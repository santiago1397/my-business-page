"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";

const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.?<>/";

export function ScrambleReveal({
  text = "Venezuelan-founded",
  flag = "🇻🇪",
}: {
  text?: string;
  flag?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = React.useState(text);
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let frame = 0;
    const totalFrames = 36; // ~600ms at 60fps
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 600);
      frame++;
      // Build scrambled string with per-character settle progress
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const charProgress = Math.max(0, t - (i / text.length) * 0.7);
        if (charProgress >= 1 || text[i] === "-") {
          out += text[i];
        } else {
          out += CHARSET[Math.floor(Math.random() * CHARSET.length)];
        }
      }
      setDisplay(out);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text]);

  return (
    <span
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative inline-flex items-center font-mono text-xs text-neutral-500 cursor-default"
    >
      <span className="tracking-wider">{display}</span>
      <motion.span
        initial={false}
        animate={{
          opacity: hover ? 1 : 0,
          scale: hover ? 1 : 0.6,
          width: hover ? "1.1em" : 0,
          marginLeft: hover ? 6 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="overflow-hidden inline-flex items-center text-sm"
        aria-hidden="true"
      >
        {flag}
      </motion.span>
    </span>
  );
}
