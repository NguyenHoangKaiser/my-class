import { useState } from "react";

import { signIn } from "next-auth/react";
import {
  MobileMenuButton,
  Logo,
  LoggedOutLinks,
  ThemeButton,
  LoggedInSection,
  LoggedOutSection,
  LoggedInLinks,
  MobileMenu,
} from "./components";
import { useSession } from "src/hooks";

function Header() {
  const session = useSession();
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = !!session.data;
  const userMetadata = session.data?.user;

  return (
    <div>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-2 sm:px-6 lg:px-8">
        {/* <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <MobileMenuButton setIsMobileMenuOpen={setIsMobileMenuOpen} />
        </div> */}
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex flex-shrink-0 items-center">
            <Logo />
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <nav className="flex space-x-4">
              {isLoggedIn ? (
                userMetadata?.role && (
                  <LoggedInLinks role={userMetadata?.role} />
                )
              ) : (
                <LoggedOutLinks />
              )}
            </nav>
          </div>
        </div>
        <div className="flex items-center pr-2 sm:ml-6 sm:pr-0">
          {isLoggedIn ? (
            <LoggedInSection image={userMetadata?.image} />
          ) : (
            <LoggedOutSection signIn={signIn} />
          )}
        </div>
      </div>

      {/* {isMobileMenuOpen && (
        <MobileMenu isLoggedIn={isLoggedIn} hasRole={userMetadata?.role} />
      )} */}
    </div>
  );
}

export default Header;
