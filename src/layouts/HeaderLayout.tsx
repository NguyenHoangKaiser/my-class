import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import MyFooter from "src/components/common/Footer";
import MyHeader from "src/components/common/Header";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/router";

const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Classroom List", "/classrooms", <ReadOutlined />),
  getItem(
    "Option 2",
    "/classrooms/cleo2ggql0003tz2cbudy4vs0",
    <DesktopOutlined />
  ),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

function HeaderLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, colorBgLayout },
  } = theme.useToken();
  const router = useRouter();
  console.log("HeaderLayout", router.asPath);
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        theme="light"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: colorBgLayout,
          }}
        />
        <Menu
          onClick={({ key }) => {
            router.push(key.toString());
          }}
          defaultSelectedKeys={["/classrooms/cleo2ggql0003tz2cbudy4vs0"]}
          mode="inline"
          items={items}
          style={{
            borderRight: 0,
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, backgroundColor: colorBgContainer }}>
          <MyHeader />
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          {children}
        </Content>
        <Footer
          style={{
            backgroundColor: colorBgContainer,
            maxHeight: 48,
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
          }}
        >
          <MyFooter />
        </Footer>
      </Layout>
    </Layout>
  );
}

export default HeaderLayout;
