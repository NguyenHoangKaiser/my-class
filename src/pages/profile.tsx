import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import ProfileScreen from "src/components/screens/profile/ProfileScreen";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";

const ProfilePage: NextPage = () => {
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
