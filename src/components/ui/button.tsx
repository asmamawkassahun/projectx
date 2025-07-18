import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "outline";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex w-11 aspect-square items-center justify-center text-xl transition-all duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2";

  const variantStyles = {
    primary:
      "text-white bg-white/10 hover:bg-white/20 disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-800 focus-visible:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-400",
    danger:
      "bg-red-600 hover:bg-red-500 text-white focus-visible:ring-red-600 disabled:bg-gray-300 disabled:text-gray-500",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-500 disabled:text-gray-400",
    outline:
      "bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 focus-visible:ring-gray-500 disabled:border-gray-200 disabled:text-gray-400",
  };

  const sizeStyles = {
    xs: "text-xs py-1 px-2 gap-1",
    sm: "text-xs py-1.5 px-3 gap-1.5",
    md: "text-lg w-11 h-11",
    lg: "text-base py-2.5 px-5 gap-2.5",
  };

  const fullWidthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidthStyle,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {!isLoading && icon && iconPosition === "left" && (
        <span className="flex items-center justify-center">{icon}</span>
      )}

      {children}

      {!isLoading && icon && iconPosition === "right" && (
        <span className="flex items-center justify-center">{icon}</span>
      )}
    </button>
  );
};

export default Button;
