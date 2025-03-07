import React from "react";
import Spinner from "./Spinner";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "danger";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  isLoading = false,
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={cn(
        "ui-button",
        variant,
        props.disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;
