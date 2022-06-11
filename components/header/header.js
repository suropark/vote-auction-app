import React, { useContext } from "react";
import classes from "./header.module.css";
import { Layout, Col, Row } from "antd";
import { useWeb3 } from "../../pages/useWeb3";
import { Web3Context } from "../../pages/web3Context";
const { Header: LayoutHeader } = Layout;

function Header() {
  const t = useWeb3();
  return (
    <LayoutHeader className={classes.container}>
      <Row>
        <Col span={8} offset={8}>
          메뉴
        </Col>
        <Col span={8} onClick={t.connect}>
          Connect Wallet
        </Col>
      </Row>
    </LayoutHeader>
  );
}

export default Header;
