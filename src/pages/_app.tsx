import type { AppType, AppProps } from "next/app";
import { type Session } from "next-auth";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ConfigProvider } from "antd";
import type { ReactElement } from "react";
import type { NextPage } from "next";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import HeaderLayout from "src/layouts/HeaderLayout";

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
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionProvider session={session}>
      <ThemeProvider storageKey="theme" attribute="class">
        <ConfigProvider>
          <NextNProgress color={"blue"} options={{ showSpinner: true }} />
          <HeaderLayout>{getLayout(<Component {...pageProps} />)}</HeaderLayout>
        </ConfigProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
