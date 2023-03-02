import Link from "next/link";

type TMobileMenuProps = {
  isLoggedIn: boolean;
  hasRole: string | undefined;
};

function MobileMenu({ isLoggedIn, hasRole }: TMobileMenuProps) {
  return (
    <div className="sm:hidden" id="mobile-menu">
      <div className="space-y-1 px-2 pt-2 pb-3">
        {isLoggedIn && (
          <>
            {hasRole && hasRole === "teacher" && (
              <Link
                href="/classrooms"
                className="link-secondary block rounded-md px-3 py-2 text-base font-medium"
                aria-current="page"
              >
                Classrooms
              </Link>
            )}
            {hasRole && hasRole === "student" && (
              <>
                <Link
                  href="/dashboard"
                  className="link-secondary block rounded-md px-3 py-2 text-base font-medium"
                  aria-current="page"
                >
                  Dashboard
                </Link>
                <Link
                  href="/browse-classrooms"
                  className="link-secondary block rounded-md px-3 py-2 text-base font-medium"
                >
                  Find a Classroom
                </Link>
              </>
            )}
            {!hasRole && (
              <Link
                href="/welcome"
                className="link-secondary block rounded-md px-3 py-2 text-base font-medium"
                aria-current="page"
              >
                Finish Setup 2
              </Link>
            )}
          </>
        )}
        {!isLoggedIn && (
          <a
            href="#"
            className="link-secondary block rounded-md px-3 py-2 text-base font-medium"
          >
            Pricing
          </a>
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
