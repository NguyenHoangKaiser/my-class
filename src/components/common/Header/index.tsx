import { signIn } from "next-auth/react";
import {
  Logo,
  LoggedInSection,
  LoggedOutSection,
  LoggedInLinks,
} from "./components";
import { useSession } from "next-auth/react";

function Header({ home }: { home?: boolean }) {
  const session = useSession();
  const isLoggedIn = !!session.data;
  const userMetadata = session.data?.user;

  return (
    <div>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-11 lg:px-12">
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="ml-5 flex flex-shrink-0 items-center">
            {home && <Logo />}
          </div>
          {home && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <nav className="flex space-x-4">
                {isLoggedIn && userMetadata?.role && (
                  <LoggedInLinks role={userMetadata?.role} />
                )}
              </nav>
            </div>
          )}
        </div>
        <div className="flex items-center pr-2 sm:ml-6 sm:pr-0">
          {isLoggedIn ? (
            <LoggedInSection image={userMetadata?.image} />
          ) : (
            <LoggedOutSection signIn={signIn} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
