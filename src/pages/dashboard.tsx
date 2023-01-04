import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import DashboardScreen from "src/components/screens/dashboard";
import HeaderLayout from "src/layouts";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";

const DashboardPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <HeaderLayout>
        <DashboardScreen />
      </HeaderLayout>
    </>
  );
};

export default DashboardPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  console.log(session);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else if (!session.user?.role) {
    return {
      redirect: {
        destination: "/welcome",
        permanent: false,
      },
    };
  } else {
    return { props: {} };
  }
};
