"use client";

import React from "react";
import Card from "./Card";
import SkeletonCard from "./SkeletonCard";
import { CardItem } from "@/types/card";

interface CardListProps {
  cards: CardItem[] | null;
  loading: boolean;
}

const CardList: React.FC<CardListProps> = ({ cards, loading }) => {
  return (
    <div className="flex flex-wrap gap-6 p-6 justify-center">
      {loading ? (
        [...Array(6)].map((_, index) => <SkeletonCard key={index} />)
      ) : cards && cards.length > 0 ? (
        cards.map((card, index) => (
          <Card key={index} imageUrl={card.imageUrl} title={card.name} />
        ))
      ) : (
        <p className="text-gray-500 text-center w-full">No items found.</p>
      )}
    </div>
  );
};

export default CardList;
