export const wrapViewContract = (viewProvider, address, abi) => {
  const contract = new viewProvider.klay.Contract(abi, address);

  return {
    contract,
    call: async (method) => await contract[method].call(),
  };
};

export const wrapSendContract = (sendProvider, contractAddress, abi) => {
  async function send(method, params, options) {
    if (sendProvider.isWeb3) {
      const signer = sendProvider.provider?.getSigner();

      const contract = new ethers.Contract(contractAddress, abi, signer);
      const address = signer?.getAddress();

      const gasPrice = await sendProvider.provider
        ?.getGasPrice()
        .then((res) => {
          return ethers.utils.parseUnits("5", "gwei").add(res);
        });
      if (params.length === 0) {
        const approveTx = await contract[method]({
          from: address,
          gasPrice,
          ...options,
        });
        await approveTx.wait();
      } else {
        let gasLimit = await contract.estimateGas[method](...params);
        const approveTx = await contract[method](...params, {
          from: address,
          gasPrice,
          gasLimit: (Number(gasLimit) * 1.2).toFixed(),
          ...options,
        });
        await approveTx.wait();
      }
    } else if (sendProvider.isCaver) {
      const klay = sendProvider.provider?.klay;
      if (klay) {
        const address = window.klaytn.selectedAddress;
        const contract = new klay.Contract(abi, contractAddress);
        await contract.send(
          { from: address, gas: "3000000", ...(options ?? {}) },
          method,
          ...params
        );
      }
    } else if (sendProvider.isKlip) {
      const { requestKey } = await sendProvider.provider.excuteContract({
        method,
        abi: abi,
        constractAddress: contractAddress,
        params,
        options,
      });

      await sendProvider.provider.pollResult(requestKey);
    }
  }

  return {
    send,
  };
};
