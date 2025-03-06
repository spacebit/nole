"use client";

import React from "react";
import Card from "./Card";
import SkeletonCard from "./SkeletonCard";
import { CardItem } from "@/types/card";

interface CardListProps {
  cards: CardItem[] | null;
  loading: boolean;
  variant?: "small" | "large";
  onCardClick?: (card: CardItem) => void;
}

const CardList: React.FC<CardListProps> = ({
  cards,
  loading,
  variant = "small",
  onCardClick,
}) => {
  return (
    <div className="flex flex-wrap gap-6 p-6 justify-center">
      {loading ? (
        [...Array(3)].map((_, index) => (
          <SkeletonCard key={index} variant={variant} />
        ))
      ) : cards && cards.length > 0 ? (
        cards.map((card, i) => (
          <Card
            key={i}
            imageUrl={card.image}
            title={card.name}
            variant={variant}
            onClick={onCardClick ? () => onCardClick(card) : undefined}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center w-full">No items found.</p>
      )}
    </div>
  );
};

export default CardList;
