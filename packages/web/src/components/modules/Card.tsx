import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Text from "@/components/ui/Text";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  title?: string;
  variant?: "small" | "large";
  onClick?: () => void;
}

const sizeClasses = {
  large: {
    container: "w-56 h-72",
    imageContainer: "h-48",
    titleText: "text-sm",
  },
  small: {
    container: "w-28 h-36",
    imageContainer: "h-24",
    titleText: "text-xs",
  },
};

const Card: React.FC<CardProps> = ({ imageUrl, title, variant = "small", onClick, className, ...props }) => {
  const { container, imageContainer, titleText } = sizeClasses[variant];

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:scale-105",
        container,
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className={cn("relative w-full", imageContainer)}>
        <Image
          src={imageUrl}
          alt={title || "Card image"}
          fill
          className="rounded-t-lg object-cover"
        />
      </div>
      {title && (
        <div className="p-3 text-center">
          <Text variant="h3" className={cn("font-semibold text-gray-800", titleText)}>
            {title}
          </Text>
        </div>
      )}
    </div>
  );
};

export default Card;
