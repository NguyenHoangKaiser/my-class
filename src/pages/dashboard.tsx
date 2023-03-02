import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import DashboardScreen from "src/components/screens/dashboard";
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

      <DashboardScreen />
    </>
  );
};

export default DashboardPage;

/**
 * We use getServerSideProps to check if the user is logged in and if they have a role.
 * If they don't have a role, we redirect them to the welcome page.
 * @param context
 * @returns
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

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
  } else if (session.user.role === "teacher") {
    return {
      redirect: {
        destination: "/classrooms",
        permanent: false,
      },
    };
  } else {
    return { props: {} };
  }
};
