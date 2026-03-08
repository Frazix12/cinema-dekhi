"use client";

import Link from "next/link";
import { Inter } from "@/utils/fonts";
import { cn } from "@/utils/helpers";

export interface BrandLogoProps {
  animate?: boolean;
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ animate = false, className }) => {
  return (
    <Link href="/" className="group">
      <span
        className={cn(
          "flex items-center gap-0.5 text-base font-bold tracking-[0.14em] md:text-3xl md:tracking-[0.18em]",
          "transition-[letter-spacing] group-hover:tracking-[0.28em]",
          "bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent",
          {
            "bg-size-[200%_100%] animate-shine": animate,
          },
          Inter.className,
          className,
        )}
      >
        CINEMA DEKHI
      </span>
    </Link>
  );
};

export default BrandLogo;
