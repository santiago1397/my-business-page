import { cn } from "@/app/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="7" fill="#0a0a0a" />
        <path
          d="M8 9 L8 23 L12 23 L12 14 L20 23 L24 23 L24 9 L20 9 L20 18 L12 9 Z"
          fill="#AD46FB"
        />
      </svg>
      <span className="font-semibold tracking-tight text-[15px]">
        V<span className="text-brand-purple">.</span>OS
      </span>
    </div>
  );
}
