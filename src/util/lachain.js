import { defineChain } from "viem";

export const lachain = defineChain({
  id: 418,
  name: "LaChain",
  testnet: true,
  nativeCurrency: { name: "LaChain", symbol: "TLA", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.lachain.network"] }
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://testexplorer.lachain.network/" }
  }
});
