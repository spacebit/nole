import { Hex } from "@nilfoundation/niljs";

export interface CardItem {
  name: string;
  image: string;
}

export interface CollectionCard extends CardItem {
  address: Hex;
}
