"use client";

import { ReactNode } from "react";

interface PixelTextProps {
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  children?: ReactNode;
}

const sizeStyles = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

export function PixelText({
  className = "",
  as: Component = "span",
  size = "md",
  children
}: PixelTextProps) {
  return (
    <Component className={`font-pixel ${sizeStyles[size]} ${className}`}>
      {children}
    </Component>
  );
}
