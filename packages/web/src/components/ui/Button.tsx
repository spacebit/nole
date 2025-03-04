import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantStyles = {
  primary: "bg-black text-white font-bold hover:bg-gray-900",
  secondary: "bg-transparent border border-black text-black font-bold hover:bg-gray-100",
  danger: "bg-red-500 text-white font-bold hover:bg-red-600",
};

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
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm focus:outline-none transition-colors duration-150 ${
        variantStyles[variant]
      } ${props.disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {isLoading && (
        <span className="animate-spin mr-2 border-2 border-t-transparent border-white rounded-full w-4 h-4" />
      )}
      {children}
    </button>
  );
};

export default Button;
