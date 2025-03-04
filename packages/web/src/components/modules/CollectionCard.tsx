"use client";

import React from "react";
import Image from "next/image";
import Text from "../ui/Text";

interface CollectionCardProps {
  imageUrl: string;
  title: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ imageUrl, title }) => {
  return (
    <div className="flex flex-col items-center bg-white shadow-md rounded-lg overflow-hidden w-64">
      <div className="w-full h-64 relative">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <Text variant="h3" className="text-center">
          {title}
        </Text>
      </div>
    </div>
  );
};

export default CollectionCard;
