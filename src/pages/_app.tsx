import type { AppType, AppProps } from "next/app";
import { type Session } from "next-auth";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ConfigProvider, theme as Theme } from "antd";
import type { ReactElement } from "react";
import { useEffect } from "react";
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import ThemeButton, {
  modeAtom,
  Themes,
} from "src/components/common/Header/components/ThemeButton";
import { StyleProvider } from "@ant-design/cssinjs";
import { atom, useAtom } from "jotai";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
export const sizeAtom = atom(windowWidth);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const [mode] = useAtom(modeAtom);

  const [, setSize] = useAtom(sizeAtom);

  useEffect(() => {
    const handleWindowResize = () => {
      setSize(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  const { defaultAlgorithm, darkAlgorithm } = Theme;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <ThemeProvider storageKey="theme" attribute="class">
        <ConfigProvider
          theme={{
            algorithm: mode === Themes.Dark ? darkAlgorithm : defaultAlgorithm,
          }}
        >
          <StyleProvider hashPriority="high">
            <NextNProgress color={"blue"} options={{ showSpinner: true }} />
            <ThemeButton />
            {getLayout(<Component {...pageProps} />)}
          </StyleProvider>
        </ConfigProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
