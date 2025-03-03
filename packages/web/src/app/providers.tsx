"use client";

import NilProvider from "@/contexts/NilContext";
import { NilWalletProvider } from "@/contexts/NilWalletContext";
import { PinataProvider } from "@/contexts/PinataContext";
import { SecretsProvider } from "@/contexts/SecretsContext";
import { type ReactNode } from "react";

export function Providers(props: { children: ReactNode }) {
  return (
    <PinataProvider>
      <NilWalletProvider>
        <SecretsProvider>
          <NilProvider>{props.children}</NilProvider>
        </SecretsProvider>
      </NilWalletProvider>
    </PinataProvider>
  );
}
