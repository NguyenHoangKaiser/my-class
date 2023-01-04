import classNames from "classnames";
import Footer from "src/components/common/Footer";
import Header from "src/components/common/Header";

type TProp = {
  children: React.ReactNode;
  useContainer?: boolean;
};

function HeaderLayout({ children, useContainer = true }: TProp) {
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
}

export default HeaderLayout;
