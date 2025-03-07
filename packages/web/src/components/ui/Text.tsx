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
    h1: "text-4xl font-bold tracking-tight mt-6 mb-4",
    h2: "text-3xl font-bold tracking-tight mt-5 mb-3",
    h3: "text-2xl font-semibold tracking-tight mt-4 mb-3",
    h4: "text-xl font-medium tracking-tight mt-3 mb-2",
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
