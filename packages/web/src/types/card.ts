import { Hex } from "@nilfoundation/niljs";

export interface CardItem {
  name: string;
  imageUrl: string;
}

export interface CollectionCard extends CardItem {
  address: Hex;
}
