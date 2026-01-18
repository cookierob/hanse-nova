"use client";

import { ReactNode, forwardRef, MouseEventHandler } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

const variantStyles = {
  primary:
    "bg-hanse-gold hover:bg-hanse-gold-dark text-hanse-ink border-2 border-hanse-gold-dark",
  secondary:
    "bg-hanse-wood hover:bg-hanse-wood-light text-hanse-parchment border-2 border-hanse-wood-light",
  danger:
    "bg-red-700 hover:bg-red-800 text-white border-2 border-red-900",
  ghost:
    "bg-transparent hover:bg-hanse-parchment-dark text-hanse-ink border-2 border-transparent",
};

const sizeStyles = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, disabled, onClick, type = "button" }, ref) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={`
          font-pixel font-bold
          transition-colors duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
