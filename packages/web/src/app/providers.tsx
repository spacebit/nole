"use client";

import NilProvider from "@/contexts/NilContext";
import { NilWalletProvider } from "@/contexts/NilWalletContext";
import { SecretsProvider } from "@/contexts/SecretsContext";
import { type ReactNode } from "react";

export function Providers(props: { children: ReactNode }) {
  return (
    <NilWalletProvider>
      <SecretsProvider>
        <NilProvider>{props.children}</NilProvider>
      </SecretsProvider>
    </NilWalletProvider>
  );
}
