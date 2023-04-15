import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import ProfileScreen from "src/components/screens/profile/ProfileScreen";
import HeaderLayout from "src/layouts/HeaderLayout";
import type { NextPageWithLayout } from "src/pages/_app";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";

const UserPage: NextPageWithLayout = () => {
  const router = useRouter();
  const userId = router.query.userId as string;

  return (
    <>
      <Head>
        <title>{`User ${userId}`}</title>
        <meta name="User overview" content="User overview" />
      </Head>

      <ProfileScreen userId={userId} />
    </>
  );
};

UserPage.getLayout = (page) => <HeaderLayout>{page}</HeaderLayout>;

export default UserPage;

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
  } else {
    return { props: {} };
  }
};
