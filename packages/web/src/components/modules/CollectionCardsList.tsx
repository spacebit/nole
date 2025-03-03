"use client";

import React from "react";
import CollectionCard from "./CollectionCard";

interface Collection {
  id: string;
  imageUrl: string;
  title: string;
}

interface CollectionCardsListProps {
  collections: Collection[];
}

const CollectionCardsList: React.FC<CollectionCardsListProps> = ({ collections }) => {
  return (
    <div className="flex flex-wrap gap-6 p-6 justify-center">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} imageUrl={collection.imageUrl} title={collection.title} />
      ))}
    </div>
  );
};

export default CollectionCardsList;
