import Link from "next/link";

type TMobileMenuProps = {
  isLoggedIn: boolean;
  hasRole: boolean;
};

function MobileMenu({ isLoggedIn, hasRole }: TMobileMenuProps) {
  return (
    <div className="sm:hidden" id="mobile-menu">
      <div className="space-y-1 px-2 pt-2 pb-3">
        {isLoggedIn && (
          <>
            {hasRole && (
              <>
                <a
                  href="#"
                  className="link-secondary block rounded-md px-3 py-2 text-base font-medium"
                  aria-current="page"
                >
                  Dashboard
                </a>
                <a
                  href="#"
                  className="link-secondary block rounded-md px-3 py-2 text-base font-medium"
                >
                  Assignments
                </a>
                <a
                  href="#"
                  className="link-secondary block rounded-md px-3 py-2 text-base font-medium"
                >
                  Students
                </a>
              </>
            )}
            {!hasRole && (
              <Link
                href="/welcome"
                className="link-secondary block rounded-md px-3 py-2 text-base font-medium"
                aria-current="page"
              >
                Finish Setup
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
