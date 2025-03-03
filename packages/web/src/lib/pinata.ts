"use server";

import { PinataSDK } from "pinata-web3";

export async function getPinataInstance() {
  if (!process.env.PINATA_JWT || !process.env.NEXT_PUBLIC_GATEWAY_URL) {
    throw new Error("❌ Pinata environment variables are missing!");
  }

  return new PinataSDK({
    pinataJwt: process.env.PINATA_JWT!,
    pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!,
  });
}