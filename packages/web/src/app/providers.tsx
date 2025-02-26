"use client";

import NilProvider from "@/contexts/NilContext";
import { WalletProvider } from "@/contexts/SecretsContext";
import { type ReactNode } from "react";

export function Providers(props: { children: ReactNode }) {
  return (
    <WalletProvider>
      <NilProvider>{props.children}</NilProvider>
    </WalletProvider>
  );
}
