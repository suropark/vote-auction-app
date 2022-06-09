import Caver from "caver-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { mainnetURI } from "../stores/constants/options";
import Web3Modal from "web3modal";
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
const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [viewProvider, setViewProvider] = useState(new Caver(mainnetURI));
  const [sendProvider, setSendProvider] = useState(null);

  const [web3Modal, setWeb3Modal] = useState(null);

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
      // ["custom-klip"]: {
      //     display: {
      //         logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCA4OCA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzExNTo1MTcpIj4KPHBhdGggZD0iTTcxLjU4NiA2QzcyLjA5IDYuMTAxNSA3Mi41OTQxIDYuMTgwNDcgNzMuMDg2OSA2LjMwNDUzQzc0Ljc3MDEgNi42OTMzOCA3Ni4yNzA0IDcuNjUwNjUgNzcuMzM4MyA5LjAxNzE4Qzc4LjQwNjEgMTAuMzgzNyA3OC45NzcxIDEyLjA3NzIgNzguOTU2NCAxMy44MTU4Qzc5LjAwODcgMTkuNjM1NCA3OS4wMDg3IDI1LjQ1NDkgNzguOTU2NCAzMS4yNzQ0Qzc4Ljk2OTEgMzIuMzA2OSA3OC43NzM3IDMzLjMzMTIgNzguMzgyIDM0LjI4NTVDNzcuOTkwMyAzNS4yMzk3IDc3LjQxMDUgMzYuMTA0MSA3Ni42Nzc1IDM2LjgyNjNDNzUuOTQ0NiAzNy41NDg0IDc1LjA3MzggMzguMTEzNCA3NC4xMTc4IDM4LjQ4N0M3My4xNjE4IDM4Ljg2MDcgNzIuMTQwNCAzOS4wMzUyIDcxLjExNTUgMzlINjQuMzk0N1YzNi43NDQ0SDcwLjQ2NThDNzEuMjc1OSAzNi44MDExIDcyLjA4ODkgMzYuNjg3IDcyLjg1MjYgMzYuNDA5M0M3My42MTY0IDM2LjEzMTYgNzQuMzE0MyAzNS42OTY1IDc0LjkwMTUgMzUuMTMxOEM3NS40ODg3IDM0LjU2NyA3NS45NTI1IDMzLjg4NTEgNzYuMjYzIDMzLjEyOTdDNzYuNTczNSAzMi4zNzQyIDc2LjcyNDEgMzEuNTYxOCA3Ni43MDUgMzAuNzQ0NEM3Ni43ODcxIDI1LjMxNTggNzYuNzg3MSAxOS44ODcyIDc2LjcwNSAxNC40NTg2Qzc2LjcyMzkgMTMuNjQwOCA3Ni41NzM0IDEyLjgyNzkgNzYuMjYzIDEyLjA3MTlDNzUuOTUyNSAxMS4zMTU5IDc1LjQ4OSAxMC42MzMzIDc0LjkwMiAxMC4wNjc3Qzc0LjMxNDkgOS41MDIxMyA3My42MTczIDkuMDY1OTEgNzIuODUzNSA4Ljc4NjkyQzcyLjA4OTcgOC41MDc5MyA3MS4yNzY1IDguMzkyMzEgNzAuNDY1OCA4LjQ0NzM4SDE4LjU4MTRDMTcuNzYyOSA4LjM5MzMgMTYuOTQyMiA4LjUxMjU1IDE2LjE3MjMgOC43OTc0NUMxNS40MDI0IDkuMDgyMzYgMTQuNzAwMyA5LjUyNjU5IDE0LjExMTQgMTAuMTAxNUMxMy41MjI1IDEwLjY3NjQgMTMuMDU5OCAxMS4zNjkyIDEyLjc1MzEgMTIuMTM1MkMxMi40NDY1IDEyLjkwMTIgMTIuMzAyNyAxMy43MjM1IDEyLjMzMTEgMTQuNTQ4OUMxMi4yNjM5IDE5LjkxNzMgMTIuMzMxMSAyNS4yODU3IDEyLjMzMTEgMzAuNjQyOUMxMi4zMDEzIDMxLjQ2ODIgMTIuNDQzNiAzMi4yOTA3IDEyLjc0ODggMzMuMDU3MkMxMy4wNTQxIDMzLjgyMzggMTMuNTE1NSAzNC41MTc0IDE0LjEwMzQgMzUuMDkzM0MxNC42OTEyIDM1LjY2OTMgMTUuMzkyNSAzNi4xMTQ4IDE2LjE2MTggMzYuNDAxMUMxNi45MzEyIDM2LjY4NzQgMTcuNzUxNyAzNi44MDgyIDE4LjU3MDIgMzYuNzU1N0g1Mi45MzU4VjE4LjcxMDVINTUuMTc2MVYzOUgxNy44OTgyQzE2Ljg3MzMgMzkuMDM1MiAxNS44NTE5IDM4Ljg2MDcgMTQuODk1OSAzOC40ODdDMTMuOTM5OSAzOC4xMTM0IDEzLjA2OTEgMzcuNTQ4NCAxMi4zMzYxIDM2LjgyNjNDMTEuNjAzMiAzNi4xMDQxIDExLjAyMzMgMzUuMjM5NyAxMC42MzE2IDM0LjI4NTVDMTAuMjM5OSAzMy4zMzEyIDEwLjA0NDUgMzIuMzA2OSAxMC4wNTczIDMxLjI3NDRDOS45OTc1MiAyNS40NTQ5IDkuOTk3NTIgMTkuNjM1NCAxMC4wNTczIDEzLjgxNThDMTAuMDM5MyAxMS45Mjc1IDEwLjcxNTkgMTAuMDk5MyAxMS45NTY4IDguNjgzMzZDMTMuMTk3NiA3LjI2NzM4IDE0LjkxNSA2LjM2Mzc4IDE2Ljc3OCA2LjE0NjYyQzE2Ljk5MDkgNi4xNDY2MiAxNy4yMDM3IDYuMDQ1MTEgMTcuNDI3NyA2SDcxLjU4NloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNC42NjI1IDIxLjU2NEMyNy4yODM2IDE5LjExNjcgMjkuODQ4NyAxNi43MDMxIDMyLjQzNjIgMTQuMzEyMUMzMi42MTQgMTQuMTg2OSAzMi44MjQxIDE0LjExNjQgMzMuMDQxIDE0LjEwOTFIMzYuMDc2NkwyOC4xMTI1IDIxLjU2NEwzNi4wNzY2IDMxLjEwNTRDMzQuOTU2NSAzMS4xMDU0IDMzLjk3MDggMzEuMTA1NCAzMy4wMTg2IDMxLjEwNTRDMzIuODAzMiAzMS4xMDE3IDMyLjU5NzkgMzEuMDEyNSAzMi40NDc0IDMwLjg1NzJDMjkuODQ4NyAyNy43MjE5IDI3LjI4MzYgMjQuNjc2OCAyNC42NjI1IDIxLjU2NFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik01Ny41MTU5IDI4Ljg0OTdWMjYuNTk0QzU3Ljg2MzEgMjYuNTk0IDU4LjE5OTEgMjYuNTI2NCA1OC41MzUyIDI2LjUyNjRDNTkuOTEyOSAyNi41MjY0IDYxLjI5MDcgMjYuNTI2NCA2Mi42NTcyIDI2LjUyNjRDNjMuMzU2NyAyNi40NjMzIDY0LjAwNzQgMjYuMTM5IDY0LjQ4MTMgMjUuNjE3MkM2NC45NTUyIDI1LjA5NTQgNjUuMjE4IDI0LjQxMzkgNjUuMjE4IDIzLjcwNjhDNjUuMjE4IDIyLjk5OTcgNjQuOTU1MiAyMi4zMTgzIDY0LjQ4MTMgMjEuNzk2NUM2NC4wMDc0IDIxLjI3NDcgNjMuMzU2NyAyMC45NTAzIDYyLjY1NzIgMjAuODg3M0M2MS4zMTMxIDIwLjgzMDkgNTkuOTY4OSAyMC44ODczIDU4LjYyNDggMjAuODg3M0g1Ny41MDQ2VjE4LjgwMDhDNTcuNTA0NiAxOC44MDA4IDU3LjU3MTkgMTguNjc2OCA1Ny42MDU1IDE4LjY3NjhDNTkuNzY3MyAxOC42NzY4IDYxLjk0MDQgMTguNjc2NyA2NC4xMDIyIDE4Ljc1NTdDNjQuNzAwOSAxOC44NDAxIDY1LjI2NTkgMTkuMDg1NiA2NS43Mzc2IDE5LjQ2NjJDNjcuNjY0MiAyMC44MDgzIDY3Ljk3NzkgMjIuOTg1IDY3LjM4NDIgMjUuNjU4QzY3LjEyNzQgMjYuNjM0NCA2Ni41MzgxIDI3LjQ4OSA2NS43MTkxIDI4LjA3MjRDNjQuOTAwMiAyOC42NTU4IDYzLjkwMzYgMjguOTMwOSA2Mi45MDM3IDI4Ljg0OTdINTcuNTE1OVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik00MC42MTMxIDE0LjAxODhWMjYuNTk0QzQwLjYxMzEgMjguNDMyMyA0MC44NTk1IDI4LjY5MTcgNDIuNzMwMSAyOC44NDk2VjMwLjk5MjVDNDAuMDQxOCAzMS40MDk4IDM4LjMyOCAyOS45Nzc0IDM4LjMyOCAyNy4zMjcxVjE0LjAxODhINDAuNjEzMVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMy42MzE5IDMxLjAzNzZIMjEuNTAzN1YxNC4xODhIMjMuNjMxOVYzMS4wMzc2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQ1LjI1MDUgMTkuODI3MUg0Ny40OTA3QzQ3LjQ5MDcgMjAuMTU0MiA0Ny41NDY3IDIwLjQ5MjYgNDcuNTQ2NyAyMC44MzA5VjI2LjU5NDFDNDcuNTQ2NyAyOC40NTUgNDcuNzcwOCAyOC42OTE4IDQ5LjY1MjYgMjguODQ5N1YzMC45OTI2QzQ2Ljk4NjcgMzEuNDU1IDQ1LjI2MTcgMzAuMDExNCA0NS4yNjE3IDI3LjM0OTdDNDUuMjM5MyAyNC44MzQ3IDQ1LjI1MDUgMjIuMzY0NyA0NS4yNTA1IDE5LjgyNzFaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDcuNDQ1OSAxNi4zMzA5SDQ1LjMxNzZWMTQuMDA3Nkg0Ny40NDU5VjE2LjMzMDlaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzExNTo1MTciPgo8cmVjdCB3aWR0aD0iNjkiIGhlaWdodD0iMzMiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCA2KSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=",
      //         name: "Kakao Klip",
      //     },
      //     package: () => {},
      //     connector: async (provider: any, options: any) => {
      //         const klipProvider = new KlipProvider(setKlipRequsetKey, setKlipQrModalOpen);
      //         const { requestKey, url } = await klipProvider.enable();
      //         // poll
      //         const resp: any = await klipProvider.pollResult(requestKey);
      //         const klaytnAddress = resp?.result?.klaytn_address;
      //         klipProvider.selectedAddress = klaytnAddress;
      //         return klipProvider;
      //     },
      // },
      // injected: {
      //     display: {
      //         logo: "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM1NSIgdmlld0JveD0iMCAwIDM5NyAzNTUiIHdpZHRoPSIzOTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMSAtMSkiPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTIuMDA0NzE3IDEzLjgxMDE5OHYtMTguMDU5NDlsNC4yNDUyODMtNC4yNDkyOTJoMjkuNzE2OTgydjIxLjI0NjQ1OSAxNC44NzI1MjNoLTMxLjgzOTYyNGwtMzkuMjY4ODY4LTE2Ljk5NzE2OXoiIGZpbGw9IiNjZGJkYjIiLz48cGF0aCBkPSJtMTk5LjUyODMwNSAzMjcuMTk1NDcyIDUwLjk0MzM5NyAxMy44MTAxOTh2LTE4LjA1OTQ5bDQuMjQ1MjgzLTQuMjQ5MjkyaDI5LjcxNjk4MXYyMS4yNDY0NTkgMTQuODcyNTIzaC0zMS44Mzk2MjNsLTM5LjI2ODg2OC0xNi45OTcxNjl6IiBmaWxsPSIjY2RiZGIyIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSA0ODMuOTYyMjcgMCkiLz48cGF0aCBkPSJtMTcwLjg3MjY0NCAyODcuODg5NTIzLTQuMjQ1MjgzIDM1LjA1NjY1NyA1LjMwNjYwNC00LjI0OTI5Mmg1NS4xODg2OGw2LjM2NzkyNSA0LjI0OTI5Mi00LjI0NTI4NC0zNS4wNTY2NTctOC40OTA1NjUtNS4zMTE2MTUtNDIuNDUyODMyIDEuMDYyMzIzeiIgZmlsbD0iIzM5MzkzOSIvPjxwYXRoIGQ9Im0xNDIuMjE2OTg0IDUwLjk5MTUwMjIgMjUuNDcxNjk4IDU5LjQ5MDA4NTggMTEuNjc0NTI4IDE3My4xNTg2NDNoNDEuMzkxNTExbDEyLjczNTg0OS0xNzMuMTU4NjQzIDIzLjM0OTA1Ni01OS40OTAwODU4eiIgZmlsbD0iI2Y4OWMzNSIvPjxwYXRoIGQ9Im0zMC43NzgzMDIzIDE4MS42NTcyMjYtMjkuNzE2OTgxNTMgODYuMDQ4MTYxIDc0LjI5MjQ1MzkzLTQuMjQ5MjkzaDQ3Ljc1OTQzNDN2LTM3LjE4MTMwM2wtMi4xMjI2NDEtNzYuNDg3MjUzLTEwLjYxMzIwOCA4LjQ5ODU4M3oiIGZpbGw9IiNmODlkMzUiLz48cGF0aCBkPSJtODcuMDI4MzAzMiAxOTEuMjE4MTM0IDg3LjAyODMwMjggMi4xMjQ2NDYtOS41NTE4ODYgNDQuNjE3NTYzLTQxLjM5MTUxMS0xMC42MjMyMjl6IiBmaWxsPSIjZDg3YzMwIi8+PHBhdGggZD0ibTg3LjAyODMwMzIgMTkyLjI4MDQ1NyAzNi4wODQ5MDU4IDMzLjk5NDMzNHYzMy45OTQzMzR6IiBmaWxsPSIjZWE4ZDNhIi8+PHBhdGggZD0ibTEyMy4xMTMyMDkgMjI3LjMzNzExNCA0Mi40NTI4MzEgMTAuNjIzMjI5IDEzLjc5NzE3IDQ1LjY3OTg4OC05LjU1MTg4NiA1LjMxMTYxNS00Ni42OTgxMTUtMjcuNjIwMzk4eiIgZmlsbD0iI2Y4OWQzNSIvPjxwYXRoIGQ9Im0xMjMuMTEzMjA5IDI2MS4zMzE0NDgtOC40OTA1NjUgNjUuODY0MDI0IDU2LjI1LTM5LjMwNTk0OXoiIGZpbGw9IiNlYjhmMzUiLz48cGF0aCBkPSJtMTc0LjA1NjYwNiAxOTMuMzQyNzggNS4zMDY2MDQgOTAuMjk3NDUxLTE1LjkxOTgxMi00Ni4yMTEwNDl6IiBmaWxsPSIjZWE4ZTNhIi8+PHBhdGggZD0ibTc0LjI5MjQ1MzkgMjYyLjM5Mzc3MSA0OC44MjA3NTUxLTEuMDYyMzIzLTguNDkwNTY1IDY1Ljg2NDAyNHoiIGZpbGw9IiNkODdjMzAiLz48cGF0aCBkPSJtMjQuNDEwMzc3NyAzNTUuODc4MTkzIDkwLjIxMjI2NjMtMjguNjgyNzIxLTQwLjMzMDE5MDEtNjQuODAxNzAxLTczLjIzMTEzMzEzIDUuMzExNjE2eiIgZmlsbD0iI2ViOGYzNSIvPjxwYXRoIGQ9Im0xNjcuNjg4NjgyIDExMC40ODE1ODgtNDUuNjM2NzkzIDM4LjI0MzYyNy0zNS4wMjM1ODU4IDQyLjQ5MjkxOSA4Ny4wMjgzMDI4IDMuMTg2OTY5eiIgZmlsbD0iI2U4ODIxZSIvPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTYuMjUtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmY2VjMyIvPjxwYXRoIGQ9Im0yMjkuMjQ1Mjg2IDMyNy4xOTU0NzIgNTUuMTg4NjgtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmY2VjMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgNTEzLjY3OTI1MiAwKSIvPjxwYXRoIGQ9Im0xMzIuNjY1MDk2IDIxMi40NjQ1OTMtMTEuNjc0NTI4IDI0LjQzMzQyNyA0MS4zOTE1MS0xMC42MjMyMjl6IiBmaWxsPSIjMzkzOTM5IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyODMuMzcyNjQ2IDApIi8+PHBhdGggZD0ibTIzLjM0OTA1NyAxLjA2MjMyMjk2IDE0NC4zMzk2MjUgMTA5LjQxOTI2NTA0LTI0LjQxMDM3OC01OS40OTAwODU4eiIgZmlsbD0iI2U4OGYzNSIvPjxwYXRoIGQ9Im0yMy4zNDkwNTcgMS4wNjIzMjI5Ni0xOS4xMDM3NzM5MiA1OC40Mjc3NjI5NCAxMC42MTMyMDc3MiA2My43MzkzNzgxLTcuNDI5MjQ1NDEgNC4yNDkyOTIgMTAuNjEzMjA3NzEgOS41NjA5MDYtOC40OTA1NjYxNyA3LjQzNjI2MSAxMS42NzQ1Mjg0NyAxMC42MjMyMjktNy40MjkyNDU0IDYuMzczOTM4IDE2Ljk4MTEzMjMgMjEuMjQ2NDU5IDc5LjU5OTA1NzctMjQuNDMzNDI4YzM4LjkxNTA5Ni0zMS4xNjE0NzMgNTguMDE4ODY5LTQ3LjA5NjMxOCA1Ny4zMTEzMjItNDcuODA0NTMzLS43MDc1NDgtLjcwODIxNS00OC44MjA3NTYtMzcuMTgxMzAzNi0xNDQuMzM5NjI1LTEwOS40MTkyNjUwNHoiIGZpbGw9IiM4ZTVhMzAiLz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAzOTkuMDU2NjExIDApIj48cGF0aCBkPSJtMzAuNzc4MzAyMyAxODEuNjU3MjI2LTI5LjcxNjk4MTUzIDg2LjA0ODE2MSA3NC4yOTI0NTM5My00LjI0OTI5M2g0Ny43NTk0MzQzdi0zNy4xODEzMDNsLTIuMTIyNjQxLTc2LjQ4NzI1My0xMC42MTMyMDggOC40OTg1ODN6IiBmaWxsPSIjZjg5ZDM1Ii8+PHBhdGggZD0ibTg3LjAyODMwMzIgMTkxLjIxODEzNCA4Ny4wMjgzMDI4IDIuMTI0NjQ2LTkuNTUxODg2IDQ0LjYxNzU2My00MS4zOTE1MTEtMTAuNjIzMjI5eiIgZmlsbD0iI2Q4N2MzMCIvPjxwYXRoIGQ9Im04Ny4wMjgzMDMyIDE5Mi4yODA0NTcgMzYuMDg0OTA1OCAzMy45OTQzMzR2MzMuOTk0MzM0eiIgZmlsbD0iI2VhOGQzYSIvPjxwYXRoIGQ9Im0xMjMuMTEzMjA5IDIyNy4zMzcxMTQgNDIuNDUyODMxIDEwLjYyMzIyOSAxMy43OTcxNyA0NS42Nzk4ODgtOS41NTE4ODYgNS4zMTE2MTUtNDYuNjk4MTE1LTI3LjYyMDM5OHoiIGZpbGw9IiNmODlkMzUiLz48cGF0aCBkPSJtMTIzLjExMzIwOSAyNjEuMzMxNDQ4LTguNDkwNTY1IDY1Ljg2NDAyNCA1NS4xODg2OC0zOC4yNDM2MjZ6IiBmaWxsPSIjZWI4ZjM1Ii8+PHBhdGggZD0ibTE3NC4wNTY2MDYgMTkzLjM0Mjc4IDUuMzA2NjA0IDkwLjI5NzQ1MS0xNS45MTk4MTItNDYuMjExMDQ5eiIgZmlsbD0iI2VhOGUzYSIvPjxwYXRoIGQ9Im03NC4yOTI0NTM5IDI2Mi4zOTM3NzEgNDguODIwNzU1MS0xLjA2MjMyMy04LjQ5MDU2NSA2NS44NjQwMjR6IiBmaWxsPSIjZDg3YzMwIi8+PHBhdGggZD0ibTI0LjQxMDM3NzcgMzU1Ljg3ODE5MyA5MC4yMTIyNjYzLTI4LjY4MjcyMS00MC4zMzAxOTAxLTY0LjgwMTcwMS03My4yMzExMzMxMyA1LjMxMTYxNnoiIGZpbGw9IiNlYjhmMzUiLz48cGF0aCBkPSJtMTY3LjY4ODY4MiAxMTAuNDgxNTg4LTQ1LjYzNjc5MyAzOC4yNDM2MjctMzUuMDIzNTg1OCA0Mi40OTI5MTkgODcuMDI4MzAyOCAzLjE4Njk2OXoiIGZpbGw9IiNlODgyMWUiLz48cGF0aCBkPSJtMTMyLjY2NTA5NiAyMTIuNDY0NTkzLTExLjY3NDUyOCAyNC40MzM0MjcgNDEuMzkxNTEtMTAuNjIzMjI5eiIgZmlsbD0iIzM5MzkzOSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjgzLjM3MjY0NiAwKSIvPjxwYXRoIGQ9Im0yMy4zNDkwNTcgMS4wNjIzMjI5NiAxNDQuMzM5NjI1IDEwOS40MTkyNjUwNC0yNC40MTAzNzgtNTkuNDkwMDg1OHoiIGZpbGw9IiNlODhmMzUiLz48cGF0aCBkPSJtMjMuMzQ5MDU3IDEuMDYyMzIyOTYtMTkuMTAzNzczOTIgNTguNDI3NzYyOTQgMTAuNjEzMjA3NzIgNjMuNzM5Mzc4MS03LjQyOTI0NTQxIDQuMjQ5MjkyIDEwLjYxMzIwNzcxIDkuNTYwOTA2LTguNDkwNTY2MTcgNy40MzYyNjEgMTEuNjc0NTI4NDcgMTAuNjIzMjI5LTcuNDI5MjQ1NCA2LjM3MzkzOCAxNi45ODExMzIzIDIxLjI0NjQ1OSA3OS41OTkwNTc3LTI0LjQzMzQyOGMzOC45MTUwOTYtMzEuMTYxNDczIDU4LjAxODg2OS00Ny4wOTYzMTggNTcuMzExMzIyLTQ3LjgwNDUzMy0uNzA3NTQ4LS43MDgyMTUtNDguODIwNzU2LTM3LjE4MTMwMzYtMTQ0LjMzOTYyNS0xMDkuNDE5MjY1MDR6IiBmaWxsPSIjOGU1YTMwIi8+PC9nPjwvZz48L3N2Zz4=",
      //         name: "Metamask",
      //         description: "Connect with the provider in your Browser",
      //     },
      //     package: null,
      // },
    };
    console.log(providerOptions);
    setWeb3Modal(
      new Web3Modal({
        // network: "mainnet", // optional
        providerOptions, // required
        cacheProvider: false,
        theme: "dark",
      })
    );
  }, []);

  const connect = useCallback(
    async (option) => {
      if (!option?.cached) {
        await web3Modal.clearCachedProvider();
      }
      console.log(web3Modal);
      const rawProvider = await web3Modal.connect();

      if (!rawProvider.isKlip) {
        // _initListeners(rawProvider);
      }

      let connectedProvider;

      // if (rawProvider.isCaver) {
      //     connectedProvider = ProviderWrapper.fromCaver(new Caver(window.klaytn));
      // } else if (rawProvider.isKlip) {
      //     connectedProvider = ProviderWrapper.fromKlip(rawProvider);
      // } else {
      //     connectedProvider = ProviderWrapper.fromWeb3Provider(new Web3Provider(rawProvider, "any"));
      // }

      // const chainId = await connectedProvider.getNetworkChainId();

      // if (rawProvider.wc) {
      //     setAddress(rawProvider.accounts[0]);
      // } else if (!rawProvider.isKaiKas) {
      //     setAddress(rawProvider.selectedAddress);
      // }

      // setProviderChainID(chainId);

      // if (rawProvider.isMetaMask) {
      //     setProvider(new Web3Provider(rawProvider, "any"));
      // }

      // setProviderWrapper(connectedProvider);

      // setConnected(true);

      return connectedProvider;
    },
    [viewProvider, web3Modal, connected]
  );
  console.log(web3Modal);

  const onChainProvider = useMemo(
    () => ({
      connect,
      // disconnect,
      // hasCachedProvider,
      // provider,
      // connected,
      // address,
      // chainID,
      web3Modal,
      // providerChainID,
      // checkWrongNetwork,
      // providerWrapper,
      // klipQrModalOpen,
      // setKlipQrModalOpen,
      // klipRequestKey,
      // blockNumber,
    }),
    [
      // klipRequestKey,
      connect,
      // disconnect,
      // hasCachedProvider,
      // provider,
      // connected,
      // address,
      // chainID,
      web3Modal,
      // providerChainID,
      // providerWrapper,
      // klipQrModalOpen,
      // setKlipQrModalOpen,
      // blockNumber,
    ]
  );
  //@ts-ignore
  return (
    <Web3Context.Provider value={{ onChainProvider }}>
      {children}
    </Web3Context.Provider>
  );
};
