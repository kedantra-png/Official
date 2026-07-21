"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const flowButtonClassName =
  "group relative inline-flex cursor-pointer items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-white/25 bg-transparent px-8 py-3 text-sm font-semibold text-white transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] hover:border-transparent hover:text-black active:scale-[0.95]";

export function FlowButton({
  text = "Modern Button",
  href,
}: {
  text?: string;
  href?: string;
}) {
  const content = (
    <>
      <ArrowRight className="absolute left-[-25%] z-[9] h-4 w-4 stroke-white fill-none transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4 group-hover:stroke-black" />
      <span className="relative z-[1] -translate-x-3 transition-all duration-[800ms] ease-out group-hover:translate-x-3">
        {text}
      </span>
      <span className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100" />
      <ArrowRight className="absolute right-4 z-[9] h-4 w-4 stroke-white fill-none transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%] group-hover:stroke-black" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={flowButtonClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={flowButtonClassName}>
      {content}
    </button>
  );
}
