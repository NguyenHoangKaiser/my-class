import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import MyHeader from "src/components/common/Header";
import {
  FileOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  ReadOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import logo from "src/assets/logo.png";
import Link from "next/link";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const itemsTeacher: MenuItem[] = [
  {
    label: "Classrooms",
    key: "/classrooms",
    icon: <ReadOutlined />,
  },
  {
    label: "Profile",
    key: "/profile",
    icon: <UserOutlined />,
  },
  // {
  //   label: "Team",
  //   key: "sub2",
  //   icon: <TeamOutlined />,
  //   children: [
  //     {
  //       label: "Team 1",
  //       key: "6",
  //     },
  //     {
  //       label: "Team 2",
  //       key: "8",
  //     },
  //   ],
  // },
  // {
  //   label: "Files",
  //   key: "9",
  //   icon: <FileOutlined />,
  // },
];

const itemsStudent: MenuItem[] = [
  {
    label: "Classrooms",
    key: "/dashboard",
    icon: <ReadOutlined />,
  },
  {
    label: "Browse Classrooms",
    key: "/browse-classrooms",
    icon: <SearchOutlined />,
  },
  {
    label: "Profile",
    key: "/profile",
    icon: <UserOutlined />,
  },
  // {
  //   label: "Team",
  //   key: "sub2",
  //   icon: <TeamOutlined />,
  //   children: [
  //     {
  //       label: "Team 1",
  //       key: "6",
  //     },
  //     {
  //       label: "Team 2",
  //       key: "8",
  //     },
  //   ],
  // },
];

function HeaderLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);
  const { token } = theme.useToken();
  const session = useSession();
  const isLoggedIn = !!session.data;
  const userMetadata = session.data?.user;

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
        trigger={null}
        collapsed={collapsed}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          overflow: "auto",
          height: "100vh",
          left: 0,
          borderRightWidth: 1,
          borderColor: token.colorBorder,
        }}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="m-4 flex h-9 items-center justify-center">
          {collapsed ? (
            <Link href="/">
              <Image src={logo} alt="Logo" width={32} height={32} />
            </Link>
          ) : (
            <Link href="/">My-Classroom</Link>
          )}
        </div>
        <Menu
          onClick={({ key }) => {
            router.push(key.toString());
          }}
          selectedKeys={[router.asPath]}
          mode="inline"
          items={
            isLoggedIn && userMetadata?.role === "teacher"
              ? itemsTeacher
              : itemsStudent
          }
          style={{
            borderRight: 0,
          }}
        />
      </Sider>
      <Layout style={{ position: "relative" }}>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            padding: 0,
            borderBottomWidth: 1,
            borderColor: token.colorBorder,
            backgroundColor: token.colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              title: collapsed ? "Expand" : "Collapse",
              style: {
                fontSize: 20,
                marginLeft: 16,
                position: "absolute",
                top: 23,
                left: 0,
              },
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <MyHeader />
        </Header>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
}

export default HeaderLayout;
