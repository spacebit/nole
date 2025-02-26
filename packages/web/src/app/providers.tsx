"use client";

import { WalletProvider } from "@/contexts/SecretsContext";
import { type ReactNode } from "react";

export function Providers(props: { children: ReactNode }) {
  return <WalletProvider>{props.children}</WalletProvider>;
}
