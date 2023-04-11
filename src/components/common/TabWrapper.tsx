import { Col, Row } from "antd";
import React from "react";

type Props = {
  children: React.ReactNode;
};

function TabWrapper({ children }: Props) {
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        flexGrow: 1,
      }}
    >
      <Col span={24}>{children}</Col>
    </Row>
  );
}

export default TabWrapper;
