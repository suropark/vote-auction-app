import axios from "axios";
import platform from "platform-detect";

import dynamic from "next/dynamic";

const klipRequest = dynamic(
  () => import("klip-sdk").then((mod) => mod.request),
  {
    ssr: false,
  }
);
const SERVER_URL = "https://a2a-api.klipwallet.com";
const PREPARE = "/v2/a2a/prepare";
const RESULT = "/v2/a2a/result?request_key=";
const BAPP = "Vote-Auction";
async function prepare(params) {
  const { data } = await axios.post(`${SERVER_URL}${PREPARE}`, {
    params,
  });

  return data;
}
async function request(reqKey) {
  const urls = {
    ios: `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${reqKey}`,
    and: `intent://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${reqKey}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`,
    pc: `https://klipwallet.com/?target=/a2a?request_key=${reqKey}`,
  };

  let os = "pc";
  if (platform.android) {
    os = "and";
  } else if (platform.ios) {
    os = "ios";
  }
  if (os === "pc") {
    return urls["pc"];
  }
  await klipRequest(reqKey);

  return;
}

export const getKlipProvider = (setQr, setModalOpen) => {
  async function enable() {
    const authParams = {
      type: "auth",
      BAPP,
    };
    const data = await prepare(authParams);
    const requestKey = data["request_key"];
    const url = await request(requestKey);

    if (url) {
      setQr?.(url);
      setModalOpen(true);
    }

    return { requestKey, url };
  }
  async function excuteContract({
    constractAddress,
    abi,
    method,
    params,
    options,
  }) {
    const methodAbi = abi.find(({ name }) => name === method);

    const excuteContractParams = {
      type: "execute_contract",
      transaction: {
        to: constractAddress,
        value: options?.value ?? "0",
        abi: JSON.stringify(methodAbi),
        params: JSON.stringify(
          params.map((v) => {
            if (typeof v === "boolean") {
              return v;
            } else {
              return v?.toString?.() ?? v;
            }
          })
        ),
      },
    };

    const data = await prepare(excuteContractParams);
    const requestKey = data["request_key"];
    const url = await request(requestKey);

    if (url) {
      setQr?.(url);
      setModalOpen(true);
    }

    return { requestKey, url };
  }

  function pollResult(requestKey) {
    const timeout = 1000 * 60 * 5;
    let count = 0;
    const tick = 2000;
    let interverId = undefined;

    return new Promise((res, rej) => {
      interverId = setInterval(async () => {
        const resp = await axios.get(`${SERVER_URL}${RESULT}${requestKey}`);
        const result = resp.data;

        if (result.status !== "prepared") {
          clearInterval(interverId);
          setModalOpen(false);
          res(result);
        }

        if (timeout < tick * count) {
          clearInterval(interverId);
          setModalOpen(false);
          rej("timeout");
        }

        count++;
      }, tick);
    });
  }

  return {
    enable,
    excuteContract,
    pollResult,
  };
};
