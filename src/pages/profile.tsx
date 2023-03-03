import type { GetServerSideProps } from "next";
import Head from "next/head";
import ProfileScreen from "src/components/screens/profile/ProfileScreen";
import HeaderLayout from "src/layouts/HeaderLayout";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import type { NextPageWithLayout } from "./_app";

const ProfilePage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Profile page" />
      </Head>

      <ProfileScreen />
    </>
  );
};

ProfilePage.getLayout = (page) => <HeaderLayout>{page}</HeaderLayout>;

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return { props: {} };
  }
};
