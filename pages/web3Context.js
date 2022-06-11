import Caver from "caver-js";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { mainnetURI } from "../stores/constants/options";
import Web3Modal from "web3modal";
import { getKlipProvider } from "../utils/klip";
export const Web3Context = createContext(null);

export const Web3ContextProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [viewProvider, setViewProvider] = useState(new Caver(mainnetURI));
  const [sendProvider, setSendProvider] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);

  // klip
  const [klipRequestKey, setKlipRequestKey] = useState("");
  const [klipQrModalOpen, setKlipQrModalOpen] = useState(false);

  useEffect(() => {
    const providerOptions = {
      ["custom-kaikas"]: {
        display: {
          logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCA4OCA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQ1LjI5MzQgMjIuMzk1Mkw1OS43NDA1IDguMTE5ODRINTkuNzYzNEM1OS43NjM0IDguMTE5ODQgNjkuNjE1OCAxNy4zNTI4IDYzLjUzNTIgMzAuNDc2NEM2My41MzUyIDMwLjQ3NjQgNjEuNjg2OCAzNC4xNzM1IDU5LjQ0MDEgMzYuMzYwOEw0NS4yOTM0IDIyLjM5NTJaTTMwLjE3MDIgMzcuMzM1TDMwLjExNDcgMzcuNDcwNUw0NC4yNzEyIDQzTDU4LjE0MDQgMzcuMzYwOUw0NC4xNDA2IDIzLjUzMDdMMzAuMTcwMiAzNy4zMzVaTTQ1LjA2NDggMkwzOS4wNjI2IDE2LjIzOThMMzguMzg2NiAxNy44NTI5TDMyLjA3MDggMzIuODM0N0w0Mi44MTE1IDIyLjIyNDJMNDMuOTYxIDIxLjA4ODZMNTcuODcyNiA3LjM0NTU4TDQ1LjA2NDggMlpNMjMuMDI4MyAyMi4xNDM1QzIyLjYwMDUgMzAuODUzOSAyNy4xNDYzIDM1LjYxMjMgMjguMjMzNyAzNi42MTg5TDI4LjM3NzQgMzYuNzUxMUwyOC41NzY2IDM2LjI4MDFMMzYuOTQ2NCAxNi40MjM3TDM3LjYyMjQgMTQuODEwN0w0Mi42MDI1IDIuOTk2ODVMMjMuMDI4MyAyMi4xNDM1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==",
          name: "KaiKas",
        },
        package: window.klaytn,
        connector: async (provider, options) => {
          const accounts = await window.klaytn.enable();
          setAddress(accounts[0]);
          return { ...window.klaytn, isCaver: true };
        },
      },
      ["custom-klip"]: {
        display: {
          logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCA4OCA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzExNTo1MTcpIj4KPHBhdGggZD0iTTcxLjU4NiA2QzcyLjA5IDYuMTAxNSA3Mi41OTQxIDYuMTgwNDcgNzMuMDg2OSA2LjMwNDUzQzc0Ljc3MDEgNi42OTMzOCA3Ni4yNzA0IDcuNjUwNjUgNzcuMzM4MyA5LjAxNzE4Qzc4LjQwNjEgMTAuMzgzNyA3OC45NzcxIDEyLjA3NzIgNzguOTU2NCAxMy44MTU4Qzc5LjAwODcgMTkuNjM1NCA3OS4wMDg3IDI1LjQ1NDkgNzguOTU2NCAzMS4yNzQ0Qzc4Ljk2OTEgMzIuMzA2OSA3OC43NzM3IDMzLjMzMTIgNzguMzgyIDM0LjI4NTVDNzcuOTkwMyAzNS4yMzk3IDc3LjQxMDUgMzYuMTA0MSA3Ni42Nzc1IDM2LjgyNjNDNzUuOTQ0NiAzNy41NDg0IDc1LjA3MzggMzguMTEzNCA3NC4xMTc4IDM4LjQ4N0M3My4xNjE4IDM4Ljg2MDcgNzIuMTQwNCAzOS4wMzUyIDcxLjExNTUgMzlINjQuMzk0N1YzNi43NDQ0SDcwLjQ2NThDNzEuMjc1OSAzNi44MDExIDcyLjA4ODkgMzYuNjg3IDcyLjg1MjYgMzYuNDA5M0M3My42MTY0IDM2LjEzMTYgNzQuMzE0MyAzNS42OTY1IDc0LjkwMTUgMzUuMTMxOEM3NS40ODg3IDM0LjU2NyA3NS45NTI1IDMzLjg4NTEgNzYuMjYzIDMzLjEyOTdDNzYuNTczNSAzMi4zNzQyIDc2LjcyNDEgMzEuNTYxOCA3Ni43MDUgMzAuNzQ0NEM3Ni43ODcxIDI1LjMxNTggNzYuNzg3MSAxOS44ODcyIDc2LjcwNSAxNC40NTg2Qzc2LjcyMzkgMTMuNjQwOCA3Ni41NzM0IDEyLjgyNzkgNzYuMjYzIDEyLjA3MTlDNzUuOTUyNSAxMS4zMTU5IDc1LjQ4OSAxMC42MzMzIDc0LjkwMiAxMC4wNjc3Qzc0LjMxNDkgOS41MDIxMyA3My42MTczIDkuMDY1OTEgNzIuODUzNSA4Ljc4NjkyQzcyLjA4OTcgOC41MDc5MyA3MS4yNzY1IDguMzkyMzEgNzAuNDY1OCA4LjQ0NzM4SDE4LjU4MTRDMTcuNzYyOSA4LjM5MzMgMTYuOTQyMiA4LjUxMjU1IDE2LjE3MjMgOC43OTc0NUMxNS40MDI0IDkuMDgyMzYgMTQuNzAwMyA5LjUyNjU5IDE0LjExMTQgMTAuMTAxNUMxMy41MjI1IDEwLjY3NjQgMTMuMDU5OCAxMS4zNjkyIDEyLjc1MzEgMTIuMTM1MkMxMi40NDY1IDEyLjkwMTIgMTIuMzAyNyAxMy43MjM1IDEyLjMzMTEgMTQuNTQ4OUMxMi4yNjM5IDE5LjkxNzMgMTIuMzMxMSAyNS4yODU3IDEyLjMzMTEgMzAuNjQyOUMxMi4zMDEzIDMxLjQ2ODIgMTIuNDQzNiAzMi4yOTA3IDEyLjc0ODggMzMuMDU3MkMxMy4wNTQxIDMzLjgyMzggMTMuNTE1NSAzNC41MTc0IDE0LjEwMzQgMzUuMDkzM0MxNC42OTEyIDM1LjY2OTMgMTUuMzkyNSAzNi4xMTQ4IDE2LjE2MTggMzYuNDAxMUMxNi45MzEyIDM2LjY4NzQgMTcuNzUxNyAzNi44MDgyIDE4LjU3MDIgMzYuNzU1N0g1Mi45MzU4VjE4LjcxMDVINTUuMTc2MVYzOUgxNy44OTgyQzE2Ljg3MzMgMzkuMDM1MiAxNS44NTE5IDM4Ljg2MDcgMTQuODk1OSAzOC40ODdDMTMuOTM5OSAzOC4xMTM0IDEzLjA2OTEgMzcuNTQ4NCAxMi4zMzYxIDM2LjgyNjNDMTEuNjAzMiAzNi4xMDQxIDExLjAyMzMgMzUuMjM5NyAxMC42MzE2IDM0LjI4NTVDMTAuMjM5OSAzMy4zMzEyIDEwLjA0NDUgMzIuMzA2OSAxMC4wNTczIDMxLjI3NDRDOS45OTc1MiAyNS40NTQ5IDkuOTk3NTIgMTkuNjM1NCAxMC4wNTczIDEzLjgxNThDMTAuMDM5MyAxMS45Mjc1IDEwLjcxNTkgMTAuMDk5MyAxMS45NTY4IDguNjgzMzZDMTMuMTk3NiA3LjI2NzM4IDE0LjkxNSA2LjM2Mzc4IDE2Ljc3OCA2LjE0NjYyQzE2Ljk5MDkgNi4xNDY2MiAxNy4yMDM3IDYuMDQ1MTEgMTcuNDI3NyA2SDcxLjU4NloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNC42NjI1IDIxLjU2NEMyNy4yODM2IDE5LjExNjcgMjkuODQ4NyAxNi43MDMxIDMyLjQzNjIgMTQuMzEyMUMzMi42MTQgMTQuMTg2OSAzMi44MjQxIDE0LjExNjQgMzMuMDQxIDE0LjEwOTFIMzYuMDc2NkwyOC4xMTI1IDIxLjU2NEwzNi4wNzY2IDMxLjEwNTRDMzQuOTU2NSAzMS4xMDU0IDMzLjk3MDggMzEuMTA1NCAzMy4wMTg2IDMxLjEwNTRDMzIuODAzMiAzMS4xMDE3IDMyLjU5NzkgMzEuMDEyNSAzMi40NDc0IDMwLjg1NzJDMjkuODQ4NyAyNy43MjE5IDI3LjI4MzYgMjQuNjc2OCAyNC42NjI1IDIxLjU2NFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik01Ny41MTU5IDI4Ljg0OTdWMjYuNTk0QzU3Ljg2MzEgMjYuNTk0IDU4LjE5OTEgMjYuNTI2NCA1OC41MzUyIDI2LjUyNjRDNTkuOTEyOSAyNi41MjY0IDYxLjI5MDcgMjYuNTI2NCA2Mi42NTcyIDI2LjUyNjRDNjMuMzU2NyAyNi40NjMzIDY0LjAwNzQgMjYuMTM5IDY0LjQ4MTMgMjUuNjE3MkM2NC45NTUyIDI1LjA5NTQgNjUuMjE4IDI0LjQxMzkgNjUuMjE4IDIzLjcwNjhDNjUuMjE4IDIyLjk5OTcgNjQuOTU1MiAyMi4zMTgzIDY0LjQ4MTMgMjEuNzk2NUM2NC4wMDc0IDIxLjI3NDcgNjMuMzU2NyAyMC45NTAzIDYyLjY1NzIgMjAuODg3M0M2MS4zMTMxIDIwLjgzMDkgNTkuOTY4OSAyMC44ODczIDU4LjYyNDggMjAuODg3M0g1Ny41MDQ2VjE4LjgwMDhDNTcuNTA0NiAxOC44MDA4IDU3LjU3MTkgMTguNjc2OCA1Ny42MDU1IDE4LjY3NjhDNTkuNzY3MyAxOC42NzY4IDYxLjk0MDQgMTguNjc2NyA2NC4xMDIyIDE4Ljc1NTdDNjQuNzAwOSAxOC44NDAxIDY1LjI2NTkgMTkuMDg1NiA2NS43Mzc2IDE5LjQ2NjJDNjcuNjY0MiAyMC44MDgzIDY3Ljk3NzkgMjIuOTg1IDY3LjM4NDIgMjUuNjU4QzY3LjEyNzQgMjYuNjM0NCA2Ni41MzgxIDI3LjQ4OSA2NS43MTkxIDI4LjA3MjRDNjQuOTAwMiAyOC42NTU4IDYzLjkwMzYgMjguOTMwOSA2Mi45MDM3IDI4Ljg0OTdINTcuNTE1OVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik00MC42MTMxIDE0LjAxODhWMjYuNTk0QzQwLjYxMzEgMjguNDMyMyA0MC44NTk1IDI4LjY5MTcgNDIuNzMwMSAyOC44NDk2VjMwLjk5MjVDNDAuMDQxOCAzMS40MDk4IDM4LjMyOCAyOS45Nzc0IDM4LjMyOCAyNy4zMjcxVjE0LjAxODhINDAuNjEzMVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMy42MzE5IDMxLjAzNzZIMjEuNTAzN1YxNC4xODhIMjMuNjMxOVYzMS4wMzc2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQ1LjI1MDUgMTkuODI3MUg0Ny40OTA3QzQ3LjQ5MDcgMjAuMTU0MiA0Ny41NDY3IDIwLjQ5MjYgNDcuNTQ2NyAyMC44MzA5VjI2LjU5NDFDNDcuNTQ2NyAyOC40NTUgNDcuNzcwOCAyOC42OTE4IDQ5LjY1MjYgMjguODQ5N1YzMC45OTI2QzQ2Ljk4NjcgMzEuNDU1IDQ1LjI2MTcgMzAuMDExNCA0NS4yNjE3IDI3LjM0OTdDNDUuMjM5MyAyNC44MzQ3IDQ1LjI1MDUgMjIuMzY0NyA0NS4yNTA1IDE5LjgyNzFaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDcuNDQ1OSAxNi4zMzA5SDQ1LjMxNzZWMTQuMDA3Nkg0Ny40NDU5VjE2LjMzMDlaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzExNTo1MTciPgo8cmVjdCB3aWR0aD0iNjkiIGhlaWdodD0iMzMiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCA2KSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=",
          name: "Kakao Klip",
        },
        package: () => {},
        connector: async (provider, options) => {
          const klipProvider = getKlipProvider(
            setKlipRequestKey,
            setKlipQrModalOpen
          );
          const { requestKey, url } = await klipProvider.enable();
          // poll
          const resp = await klipProvider.pollResult(requestKey);
          const klaytnAddress = resp?.result?.klaytn_address;
          klipProvider.selectedAddress = klaytnAddress;
          return klipProvider;
        },
      },
    };
    setWeb3Modal(
      new Web3Modal({
        // network: "mainnet", // optional
        providerOptions, // required
        cacheProvider: false,
        theme: "dark",
      })
    );
  }, []);
  const _initListeners = useCallback(
    (rawProvider) => {
      if (!rawProvider.on) {
        return;
      }

      rawProvider.on("accountsChanged", () =>
        setTimeout(() => window.location.reload(), 1)
      );

      rawProvider.on("chainChanged", async (chain) => {
        // changeNetwork(chain);
      });

      rawProvider.on("network", (_newNetwork, oldNetwork) => {
        if (!oldNetwork) return;
        window.location.reload();
      });
      rawProvider.on("pending", (tx) => {});
      rawProvider.on("block", (blockNum) => {});
    },
    [viewProvider]
  );

  const connect = useCallback(
    async (option) => {
      if (!option?.cached) {
        await web3Modal.clearCachedProvider();
      }
      const rawProvider = await web3Modal.connect();

      if (!rawProvider.isKlip) {
        _initListeners(rawProvider);
      }

      let connectedProvider;

      if (rawProvider.isCaver) {
        connectedProvider = {
          provider: new Caver(window.klaytn),
          isCaver: true,
        };
      } else if (rawProvider.isKlip) {
        connectedProvider = { provider: rawProvider, isKlip: true };
      } else {
        // connectedProvider = {
        //   provider: new web3Provider(rawProvider, "any"),
        //   isKlip: false,
        // };
      }

      // const chainId = await connectedProvider.getNetworkChainId();

      setAddress(rawProvider.selectedAddress);

      // setProviderChainID(chainId);

      // if (rawProvider.isMetaMask) {
      //     setProvider(new Web3ProviderContext(rawProvider, "any"));
      // }

      setSendProvider(connectedProvider);

      setConnected(true);

      return connectedProvider;
    },
    [viewProvider, web3Modal, connected]
  );

  const onChainProvider = useMemo(
    () => ({
      connect,
      // disconnect,
      // hasCachedProvider,
      connected,
      address,
      // chainID,
      web3Modal,
      // providerChainID,
      // checkWrongNetwork,
      viewProvider,
      sendProvider,
      klipQrModalOpen,
      setKlipQrModalOpen,
      klipRequestKey,
      // blockNumber,
    }),
    [
      connect,
      // disconnect,
      // hasCachedProvider,
      connected,
      address,
      // chainID,
      web3Modal,
      // providerChainID,
      viewProvider,
      sendProvider,
      klipQrModalOpen,
      setKlipQrModalOpen,
      klipRequestKey,
      // blockNumber,
    ]
  );
  // const onChainProvider = {};
  return (
    <Web3Context.Provider value={{ onChainProvider }}>
      {children}
    </Web3Context.Provider>
  );
};
