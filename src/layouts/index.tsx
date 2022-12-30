import classNames from "classnames";
import React from "react";
import Footer from "src/components/common/Footer";
import Header from "src/components/common/Header";

interface HeaderLayoutProps {
  children: React.ReactNode;
  useContainer?: boolean;
}

const HeaderLayout = ({ children, useContainer = true }: HeaderLayoutProps) => {
  return (
    <>
      <Header />

      <main
        className={classNames(
          useContainer && "container",
          "mx-auto flex min-h-screen flex-col"
        )}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default HeaderLayout;
