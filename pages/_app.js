import React, { useEffect } from "react";
import "../styles/globals.css";
import "antd/dist/antd.css";
import Head from "next/head";
import Layout from "../components/layout/layout";
import { Web3Provider } from "../hooks/web3Provider";
function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <title>Vote-Auction on Klaytn</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Web3Provider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Web3Provider>
    </React.Fragment>
  );
}

export default MyApp;
