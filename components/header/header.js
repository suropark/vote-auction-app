import React from "react";
import classes from "./header.module.css";
import { Layout, Col, Row } from "antd";
import { useWeb3 } from "../../hooks/web3Provider";
const { Header: LayoutHeader } = Layout;

function Header() {
  const t = useWeb3();
  console.log(t);
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
