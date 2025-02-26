import React from 'react';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'p' | 'span';

export interface TextProps {
  variant?: TextVariant;
  className?: string;
  children: React.ReactNode;
}

const Text: React.FC<TextProps> = ({ variant = 'p', className = '', children }) => {
  const Tag = variant;

  let baseStyles = '';
  switch (variant) {
    case 'h1':
      baseStyles = 'text-4xl font-bold';
      break;
    case 'h2':
      baseStyles = 'text-3xl font-bold';
      break;
    case 'h3':
      baseStyles = 'text-2xl font-semibold';
      break;
    case 'p':
      baseStyles = 'text-base';
      break;
    case 'span':
      baseStyles = 'text-sm';
      break;
    default:
      baseStyles = 'text-base';
  }

  return <Tag className={`${baseStyles} ${className}`}>{children}</Tag>;
};

export default Text;
