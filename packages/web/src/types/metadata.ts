import { Hex } from "@nilfoundation/niljs";

export interface BasicMetadata {
  name: string;
  description: string;
  image: string;
}

export interface CollectionMetadataOffchain extends BasicMetadata {
  symbol: string;
  contractURI: string;
}

export interface CollectionMetadataOnchain {
  address: Hex;
}

export interface CollectionMetadataFull
  extends CollectionMetadataOffchain,
    CollectionMetadataOnchain {}

export interface NFTMetadataOffchain extends BasicMetadata {
  attributes: Trait[];
}

export interface NFTMetadataOnchain {
  tokenURI: string;
  address: Hex;
  collectionAddress: Hex;
}

export interface NFTMetadataFull
  extends NFTMetadataOffchain,
    NFTMetadataOnchain {}

export type Trait = { trait_type: string; value: string };
