import React from "react";
import Head from "next/head";
import Header from "../header/header";
import { Layout as AntdLayout } from "antd";

function Layout({ children }) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link
          rel="preload"
          href="/fonts/Inter/Inter-Regular.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Inter/Inter-Bold.ttf"
          as="font"
          crossOrigin=""
        />
        <meta name="description" content="Vote-Auction ??" />
        <meta name="og:title" content="Vote-Auction" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div>
        <AntdLayout>
          <Header />
          {/* snackBar? if needed */}
          <main>{children}</main>
        </AntdLayout>
      </div>
    </div>
  );
}

export default Layout;
