import create from "zustand";
import { CHAIN_ID } from "./constants/constants";
import { mainnetURI } from "./constants/options";
import Web3Modal from "web3modal";

export const useAccount = create((set, get) => ({
  address: "",
  viewProvider: new Caver(mainnetURI),
  sendProvider: null,
  connected: false,
  chainId: CHAIN_ID.cypress,
}));
