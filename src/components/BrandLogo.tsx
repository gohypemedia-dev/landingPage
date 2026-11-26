import React from "react";
import Image from "next/image";
import { SHOWROOM_INFO } from "@/data/products";

interface BrandLogoProps {
  className?: string;
  isScrolled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  height?: number;
  /** Set when the logo sits on a light surface (uses the original dark-ink logo). Otherwise the ivory/gold variant is used so it reads on dark, glass or photo backgrounds. */
  inverted?: boolean;
  preload?: boolean;
}

// Both files share the same intrinsic size (transparent background)
const LOGO_SRC_LIGHT_SURFACE = "/images/mallikarjuna-new-logo.png";
const LOGO_SRC_DARK_SURFACE = "/images/mallikarjuna-new-logo-light.png";
const LOGO_WIDTH = 963;
const LOGO_HEIGHT = 212;

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  isScrolled = false,
  size = "lg",
  height: customHeight,
  inverted = false,
  preload = false,
}) => {
  const heights: Record<string, number> = {
    sm: 34,
    md: 42,
    lg: isScrolled ? 44 : 50,
    xl: 96,
  };

  const height = customHeight ?? heights[size] ?? 50;

  return (
    <span
      className={`brand-logo-container brand-logo-${size} ${inverted ? "" : "brand-logo--on-dark"} ${isScrolled ? "is-scrolled" : ""} ${className}`}
      style={{ "--brand-logo-default-height": `${height}px` } as React.CSSProperties}
    >
      <Image
        src={inverted ? LOGO_SRC_LIGHT_SURFACE : LOGO_SRC_DARK_SURFACE}
        alt={SHOWROOM_INFO.brandName}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        sizes="480px"
        preload={preload}
        draggable={false}
      />
    </span>
  );
};
