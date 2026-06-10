export interface IntroPhase {
  range: [number, number];
  wordKeys: string[];
  accent?: "purple" | "mint" | "magenta" | "lime";
  size?: "sm" | "md" | "lg" | "xl";
}

export const introPhases: IntroPhase[] = [
  {
    range: [0.0, 0.45],
    wordKeys: ["Scrolly.phase1a", "Scrolly.phase1b"],
    size: "lg",
  },
  {
    range: [0.44, 0.82],
    wordKeys: ["Scrolly.phase2"],
    accent: "lime",
    size: "xl",
  },
];
