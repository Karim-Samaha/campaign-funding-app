import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  // 0xFf7951F973d1A058A796c3A7ffEA416C5A0A1c72

  //0xE66734D650821D32F7F9623403AaC6Da25CcfACB
  networks: {
    sepolia: {
      type: "http",
      url: 'https://sepolia.infura.io/v3/5a47bf21da0f4017a7fb97801c14ac58',
      accounts: { mnemonic: "faint skill prefer reject half above angry way matter own disease velvet" }
    },
     localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk" // use local Hardhat mnemonic
      }
    }
  }
  // networks: {
  //   hardhatMainnet: {
  //     type: "edr-simulated",
  //     chainType: "l1",
  //   },
  //   hardhatOp: {
  //     type: "edr-simulated",
  //     chainType: "op",
  //   },
  //   sepolia: {
  //     type: "http",
  //     chainType: "l1",
  //     url: configVariable("SEPOLIA_RPC_URL"),
  //     accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
  //   },
  // },
});
