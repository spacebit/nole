import { Hex } from "@nilfoundation/niljs";

export interface CardItem {
  name: string;
  image: string;
  address: Hex;
}

export interface CollectionCard extends CardItem {
  address: Hex;
}
