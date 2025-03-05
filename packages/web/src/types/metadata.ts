export interface Metadata {
  name: string;
  description: string;
  image: string;
}

export interface NFTMetadata extends Metadata {
  attributes: Trait[];
}

export type Trait = { trait_type: string; value: string };
