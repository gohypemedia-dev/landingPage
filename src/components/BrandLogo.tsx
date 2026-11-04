import React from "react";
import Image from "next/image";
import { SHOWROOM_INFO } from "@/data/products";

interface BrandLogoProps {
  className?: string;
  isScrolled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  height?: number;
  /** Set when the logo sits on a light surface. Otherwise it gets a thin white outline so the red wordmark stays legible on dark/glass backgrounds. */
  inverted?: boolean;
  preload?: boolean;
}

// Intrinsic size of /images/mfw-logo.png (transparent background)
const LOGO_WIDTH = 1350;
const LOGO_HEIGHT = 278;

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  isScrolled = false,
  size = "lg",
  height: customHeight,
  inverted = false,
  preload = false,
}) => {
  const heights: Record<string, number> = {
    sm: 28,
    md: 34,
    lg: isScrolled ? 34 : 38,
    xl: 80,
  };

  const height = customHeight ?? heights[size] ?? 38;

  return (
    <span
      className={`brand-logo-container brand-logo-${size} ${inverted ? "" : "brand-logo--on-dark"} ${isScrolled ? "is-scrolled" : ""} ${className}`}
      style={{ "--brand-logo-default-height": `${height}px` } as React.CSSProperties}
    >
      <Image
        src="/images/mfw-logo.png"
        alt={SHOWROOM_INFO.brandName}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        sizes="400px"
        preload={preload}
        draggable={false}
      />
    </span>
  );
};
