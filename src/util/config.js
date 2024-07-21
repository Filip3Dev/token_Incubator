import { createConfig, http, fallback } from "wagmi";
import {  getDefaultConfig } from "connectkit";
import { sepolia } from "wagmi/chains";
import { sidechainEvm } from "./xrplEvmSidechain";
import { lachain } from "./lachain";

export const config = createConfig(
  getDefaultConfig({
    appName: "eth-r",
    chains: [sidechainEvm, lachain, sepolia],
    transports: {
      [sidechainEvm.id]: fallback([
        http(`https://rpc-evm-sidechain.xrpl.org`),
        http(`https://1440002.rpc.thirdweb.com`)
      ]),
      // [sepolia.id]:(http())
      [lachain.id]: http(`https://rpc.testnet.lachain.network`)
    },
    walletConnectProjectId: "f47f3f4d9a48263426b7e7c1eb32f9ed"
  })
);