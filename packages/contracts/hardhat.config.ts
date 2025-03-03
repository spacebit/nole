import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import config from "./utils/config";

const nilConfig: HardhatUserConfig = {
  defaultNetwork: "nil",
  solidity: {
    version: "0.8.28",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    nil: {
      url: config.rpc,
      accounts: [config.privateKey],
    },
  },
  mocha: {
    timeout: 120_000
  }
};

export default nilConfig;
