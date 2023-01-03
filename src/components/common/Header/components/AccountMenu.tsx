import { signOut } from "next-auth/react";
import Link from "next/link";

const AccountMenu = () => {
  return (
    <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 text-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-50">
      <Link
        href="/profile"
        className="link-primary block px-4 py-2 hover:bg-gray-200"
      >
        Profile
      </Link>
      <div className="w-full border-t border-gray-300" />
      <a
        onClick={() => signOut()}
        href="#"
        className="link-primary block px-4 py-2 hover:bg-gray-200"
      >
        Sign out
      </a>
    </div>
  );
};

export default AccountMenu;
