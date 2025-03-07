import React, { ElementType } from "react";

export type TextVariant = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "strong" | "em" | "small";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  className?: string;
  children: React.ReactNode;
}

const Text: React.FC<TextProps> = ({ variant = "p", className = "", children, ...props }) => {
  const Tag: ElementType = variant;

  const baseStyles = {
    h1: "text-4xl font-bold tracking-tight",
    h2: "text-3xl font-bold tracking-tight",
    h3: "text-2xl font-semibold tracking-tight",
    h4: "text-xl font-medium tracking-tight",
    p: "text-base leading-relaxed",
    span: "text-sm",
    strong: "font-bold",
    em: "italic",
    small: "text-xs text-gray-500",
  };

  return (
    <Tag className={`${baseStyles[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export default Text;
