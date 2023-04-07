import { Col, Row, Typography } from "antd";
import React from "react";
import { trpc } from "src/utils/trpc";

function OverviewTab() {
  return (
    <Row>
      <Col>
        <Typography.Title level={3}>Overview</Typography.Title>
      </Col>
    </Row>
  );
}

export default OverviewTab;
