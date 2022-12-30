import { type NextPage } from "next";
import Head from "next/head";
import HomeScreen from "src/components/screens/home";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Welcome to the Online Classroom</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomeScreen />
    </>
  );
};

export default Home;
