import HeroSection from "src/components/screens/home/HeroSection";
import FeatureSection from "src/components/screens/home/FeatureSection";
import MyFooter from "src/components/common/Footer";
import MyHeader from "src/components/common/Header";
import { Layout, theme } from "antd";
const { Header, Footer, Content } = Layout;
function HomeScreen() {
  const {
    token: { colorPrimaryBg },
  } = theme.useToken();
  return (
    <Layout>
      <Header style={{ padding: 0, backgroundColor: colorPrimaryBg }}>
        <MyHeader />
      </Header>
      <Content>
        <HeroSection />
        <FeatureSection />
      </Content>
      <Footer style={{ backgroundColor: colorPrimaryBg }}>
        <MyFooter />
      </Footer>
    </Layout>
  );
}

export default HomeScreen;
