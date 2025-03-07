"use client";

import Text from "@/components/ui/Text";
import Island from "@/components/ui/Island";
import Image from "next/image";
import SkeletonCollectionList from "./SkeletonCollectionList";
import { CollectionMetadataFull } from "@/types/metadata";

interface CollectionListProps {
  collections: CollectionMetadataFull[] | null;
  loading: boolean;
}

export default function CollectionList({ collections, loading }: CollectionListProps) {
  return (
    <Island className="w-64 flex-shrink-0 p-4">
      <Text variant="h2" className="mb-4 text-center">Collections</Text>
      {loading ? (
        <SkeletonCollectionList />
      ) : collections && collections.length > 0 ? (
        <div className="flex flex-col gap-2">
          {collections.map((collection) => (
            <div key={collection.address} className="flex items-center gap-2">
              <Image
                src={collection.image}
                alt={collection.name}
                width={40}
                height={40}
                className="rounded-md"
              />
              <Text variant="p">{collection.name}</Text>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center w-full">No collections found.</p>
      )}
    </Island>
  );
}
