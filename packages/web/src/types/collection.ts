import { Hex } from "@nilfoundation/niljs";
import { CardItem } from "./card";

export interface Collection extends CardItem {
  address: Hex
}
