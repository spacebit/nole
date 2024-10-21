import { artifacts } from "hardhat";
import {
  Faucet,
  Hex,
  HttpTransport,
  PublicClient,
  toHex,
} from "@nilfoundation/niljs";
import { expect } from "chai";
import { XWallet, XContract } from "@spacebit/simple-nil";
import config from "../config";
import { Market$Type } from "../artifacts/contracts/Market.sol/Market";

describe("XWallet", () => {
  it("Can approve tokens for transfer", async () => {});

  it("Approved account can transferFrom", async () => {});

  it("Cannot transferFrom more than allowed", async () => {});
});
