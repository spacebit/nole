import React from "react";
import Image from "next/image";

interface CardProps {
  imageUrl: string;
  title?: string;
  variant?: "small" | "large";
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  imageUrl,
  title,
  variant = "small",
  onClick,
}) => {
  const sizeClasses =
    variant === "large"
      ? {
          container: "w-56 h-72",
          imageContainer: "h-48",
          titleText: "text-sm",
        }
      : {
          container: "w-28 h-36",
          imageContainer: "h-24",
          titleText: "text-xs",
        };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 ${sizeClasses.container} cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:scale-105`}
      onClick={onClick}
    >
      <div className={`relative w-full ${sizeClasses.imageContainer}`}>
        <Image
          src={imageUrl}
          alt={title || "Card image"}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      {title && (
        <div className="p-3 text-center">
          <h3
            className={`${sizeClasses.titleText} font-semibold text-gray-800`}
          >
            {title}
          </h3>
        </div>
      )}
    </div>
  );
};

export default Card;
