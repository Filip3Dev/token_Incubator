import { signMessage } from "@wagmi/core";
import { useAccount } from "wagmi";
import { useCallback } from "react";
// Crie um hook personalizado para lidar com a assinatura
function useSignMessage() {
  const { account, library } = useAccount();

  return useCallback(
    async (message) => {
      if (library && account) {
        await signMessage(library.getSigner(account), { message });
      } else {
        console.error("Web3 provider ou conta não estão disponíveis");
      }
    },
    [account, library]
  );
}
