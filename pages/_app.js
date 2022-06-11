import React, { useEffect } from "react";
import "../styles/globals.css";
import "antd/dist/antd.css";
import Head from "next/head";
import Layout from "../components/layout/layout";
import { Web3ContextProvider } from "./web3Context";

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
      <Web3ContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Web3ContextProvider>
    </React.Fragment>
  );
}

export default MyApp;
