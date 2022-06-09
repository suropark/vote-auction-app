import { useRouter } from "next/router";
import React, { useEffect } from "react";

function Claimswap() {
  const r = useRouter();

  useEffect(() => {
    r.push("/claimswap/poolVote");
  }, []);

  return <div></div>;
}

export default Claimswap;
