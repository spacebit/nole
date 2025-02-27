import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import config from "./utils/config";
import "./tasks/deploy";

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
};

export default nilConfig;
