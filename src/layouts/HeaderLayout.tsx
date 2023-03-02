import { Card, Layout } from "antd";
import classNames from "classnames";
import MyFooter from "src/components/common/Footer";
import MyHeader from "src/components/common/Header";

const { Header, Content, Footer } = Layout;

function HeaderLayout({ children }: { children: React.ReactNode }) {
  console.log("HeaderLayout");
  return (
    <Layout
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}>
        <MyHeader />
      </Header>

      <Content
        style={{
          padding: "0 25px",
          marginTop: 24,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card
          style={{ flex: 1, padding: 4, borderRadius: 16 }}
          bodyStyle={{
            padding: "0 0",
            borderRadius: 16,
          }}
        >
          {children}
        </Card>
      </Content>

      <Footer>
        <MyFooter />
      </Footer>
    </Layout>
  );
}

export default HeaderLayout;
