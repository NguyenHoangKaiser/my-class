import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import feynman from "src/assets/richard-feynman.jpeg";
import student from "src/assets/student.jpeg";
import { trpc } from "src/utils/trpc";
import { useRouter } from "next/router";
import reloadSession from "src/utils/reloadSession";
import HeaderLayout from "src/layouts/HeaderLayout";
import Button, { Variant } from "src/components/common/Button";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";

const Welcome: NextPage = () => {
  const router = useRouter();

  const { mutateAsync: setRoleAsTeacher } =
    trpc.auth.setRoleAsTeacher.useMutation();

  const { mutateAsync: setRoleAsStudent } =
    trpc.auth.setRoleAsStudent.useMutation();

  const setTeacherRole = async () => {
    await setRoleAsTeacher();
    reloadSession();
    router.push("/classrooms");
  };

  const setStudentRole = async () => {
    await setRoleAsStudent();
    reloadSession();
    router.push("/dashboard");
  };

  return (
    <>
      <Head>
        <title>Sign up</title>
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
        <meta
          name="description"
          content="sign up now for a teacher or a student account in order to access the website"
        />
      </Head>

      <HeaderLayout>
        <main className="container m-auto">
          <div className="mx-auto flex h-full flex-col items-center justify-center p-4">
            <h1 className="text-4xl text-gray-900 dark:text-white">
              Welcome to classroom!
            </h1>
            <p className="text-gray-900 dark:text-white">
              Before we start, click what type of user you want to be:
            </p>

            <div className="mt-10 mb-4 hidden gap-8 sm:grid sm:grid-cols-2">
              <Image
                height="300"
                className="object-cover"
                src={feynman}
                alt="A picture of Richard Feynman(well known physics professor) teaching"
              />
              <Image
                height="300"
                className="object-cover"
                src={student}
                alt="A person studying"
              />
            </div>

            <div className="hidden w-full grid-cols-2 gap-8 sm:grid">
              <div className="relative flex flex-col items-center justify-center rounded">
                <Button variant={Variant.Primary} onClick={setTeacherRole}>
                  I&apos;m a teacher
                </Button>
              </div>
              <div className="relative flex flex-col items-center justify-center rounded">
                <Button onClick={setStudentRole} variant={Variant.Primary}>
                  I&apos;m a student
                </Button>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:hidden">
              <Image
                height={150}
                width={300}
                className="object-cover object-top"
                src={feynman}
                alt="A picture of Richard Feynman(well known physics professor) teaching"
              />
              <Button variant={Variant.Primary} onClick={setTeacherRole}>
                I&apos;m a teacher
              </Button>

              <Image
                height={150}
                width={300}
                className="object-cover"
                src={student}
                alt="A person studying"
              />

              <Button variant={Variant.Primary}>I&apos;m a student</Button>
            </div>
          </div>
        </main>
      </HeaderLayout>
    </>
  );
};

export default Welcome;

/**
 * We check if the user is logged in and if not we redirect them to the home page
 * If the user is logged in and has a role we redirect them to the dashboard
 * @param context
 * @returns
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else if (session?.user?.role) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  } else {
    return { props: {} };
  }
};
