import type { AppType, AppProps } from "next/app";
import { type Session } from "next-auth";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ConfigProvider, theme } from "antd";
import type { ReactElement } from "react";
import type { NextPage } from "next";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import HeaderLayout from "src/layouts/HeaderLayout";
import { useAtom } from "jotai";
import { themeAtom } from "src/components/common/Header/components/ThemeButton";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const [mode] = useAtom(themeAtom);
  console.log(mode);

  const { defaultAlgorithm, darkAlgorithm } = theme;

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionProvider session={session}>
      <ThemeProvider storageKey="theme" attribute="class">
        <ConfigProvider
          theme={{
            algorithm: mode === "dark" ? darkAlgorithm : defaultAlgorithm,
          }}
        >
          <NextNProgress color={"blue"} options={{ showSpinner: true }} />
          <HeaderLayout>{getLayout(<Component {...pageProps} />)}</HeaderLayout>
        </ConfigProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
