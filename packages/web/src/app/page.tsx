"use client";

import Header from "@/components/modules/Header";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useNilWallet } from "@/contexts/NilWalletContext";

export default function Home() {
  const { walletAddress } = useNilWallet();

  return (
    <>
      <Header />
      <Text variant="h1">Welcome to Nole</Text>
      {walletAddress && <Text variant="h3">{walletAddress}</Text>}
      <Button>Create a collection</Button>
    </>
  );
}
