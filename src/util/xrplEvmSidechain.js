import { defineChain } from "viem";

export const sidechainEvm = defineChain({
  id: 1440002,
  name: "XRPL EVM",
  testnet: true,
  nativeCurrency: { name: "XRPL EVM", symbol: "XRPL", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://1440002.rpc.thirdweb.com"] },
    public: { http: ["https://rpc-evm-sidechain.xrpl.org"] }
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://evm-sidechain.xrpl.org" }
  },
  contracts: {
    multicall2: {
      address: "0x5a73a8e6227668385b6244F2EC487a8Deac2E9E0",
      blockCreated: 2661902
    }
  }
});
