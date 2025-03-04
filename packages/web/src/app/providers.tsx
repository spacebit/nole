"use client";

import { NilClientProvider } from "@/contexts/NilClientContext";
import { NilWalletProvider } from "@/contexts/NilWalletContext";
import { PinataProvider } from "@/contexts/PinataContext";
import { UserAssetsProvider } from "@/contexts/UserAssetsContext";
import { type ReactNode } from "react";

export function Providers(props: { children: ReactNode }) {
  return (
    <PinataProvider>
      <NilWalletProvider>
        <NilClientProvider>
          <UserAssetsProvider>{props.children}</UserAssetsProvider>
        </NilClientProvider>
      </NilWalletProvider>
    </PinataProvider>
  );
}
