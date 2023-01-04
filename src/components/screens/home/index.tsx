import HeroSection from "src/components/screens/home/HeroSection";
import FeatureSection from "src/components/screens/home/FeatureSection";
import HeaderLayout from "src/layouts";

function HomeScreen() {
  return (
    <HeaderLayout useContainer={false}>
      <HeroSection />
      <FeatureSection />
    </HeaderLayout>
  );
}

export default HomeScreen;
