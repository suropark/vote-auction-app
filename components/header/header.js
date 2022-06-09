import React from "react";
import classes from "./header.module.css";
import { Layout, Col, Row } from "antd";
import { useAccount } from "../../stores/accout";
const { Header: LayoutHeader } = Layout;

function Header() {
  const { connect } = useAccount();
  return (
    <LayoutHeader className={classes.container}>
      <Row>
        <Col span={8} offset={8}>
          메뉴
        </Col>
        <Col span={8} onClick={connect}>
          Connect Wallet
        </Col>
      </Row>
    </LayoutHeader>
  );
}

export default Header;
