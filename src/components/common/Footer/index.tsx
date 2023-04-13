import { Typography, Space, Divider } from "antd";
import React from "react";

const { Text, Link } = Typography;

function Footer() {
  return (
    <div className="flex flex-1 items-center justify-between">
      <Space>
        <Text>© 2022</Text>
        <Link className="hover:underline">NGUYEN HUY HOANG</Link>
        <Text>All Rights Reserved.</Text>
      </Space>
      <Space split={<Divider type="vertical" />}>
        <Typography.Link>About</Typography.Link>
        <Typography.Link>Terms of Service</Typography.Link>
        <Typography.Link>Privacy Policy</Typography.Link>
      </Space>
    </div>
  );
}

export default Footer;
