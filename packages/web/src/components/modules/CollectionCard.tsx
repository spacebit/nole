"use client";

import React from "react";
import Image from "next/image";
import Text from "../ui/Text";

interface CollectionCardProps {
  imageUrl: string;
  title: string;
}

const isValidHttpUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const CollectionCard: React.FC<CollectionCardProps> = ({ imageUrl, title }) => {
  const placeholderImage = "../../../public/logo.svg";
  const validImageUrl = isValidHttpUrl(imageUrl) ? imageUrl : placeholderImage;

  return (
    <div className="flex flex-col items-center bg-white shadow-md rounded-lg overflow-hidden w-64">
      {/* Image */}
      <div className="w-full h-64 relative">
        <Image
          src={validImageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      {/* Title */}
      <div className="p-4">
        <Text variant="h3" className="text-center">
          {title}
        </Text>
      </div>
    </div>
  );
};

export default CollectionCard;
