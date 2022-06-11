import { useContext, useMemo } from "react";
import { Web3Context } from "./web3Context";
// import { getKlipProvider } from "../utils/klip";
export const useWeb3 = () => {
  const web3Context = useContext(Web3Context);

  if (!web3Context) {
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, " +
        "please declare it at a higher level."
    );
  }
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [web3Context]);
};

// @refresh reset
