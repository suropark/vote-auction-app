import { Tabs } from "antd";
import React from "react";
const { TabPane } = Tabs;

const Tab = ({ components }) => (
  <Tabs defaultActiveKey="1" centered>
    {components.map((component, i) => {
      return (
        <TabPane tab={component.header} key={i + 1}>
          {component.data}
        </TabPane>
      );
    })}
  </Tabs>
);

export default Tab;
