import React from "react";
import { Button } from "src/components/common/Button";
import Roles from "src/utils/constants";
const becomeRole = (role: string) => {
  fetch("/api/mock-role", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role,
    }),
  }).then(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    location.reload();
  });
};

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-50 p-4 shadow  dark:bg-gray-900">
        <div className="container mx-auto md:flex md:items-center md:justify-between md:p-6">
          <span className="text-sm text-gray-500 dark:text-gray-50 sm:text-center">
            © 2022 <a className="hover:underline">WDJ</a>. All Rights Reserved.
          </span>
          <ul className="mt-3 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-50 sm:mt-0">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </footer>

      {process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH && (
        <div className="bg-red-200">
          <div className="container mx-auto flex items-center gap-2 text-black">
            DEVELOPMENT ROLE SWITCHER:
            <Button
              onClick={() => {
                becomeRole(Roles.Student);
              }}
            >
              student
            </Button>
            <Button
              onClick={() => {
                becomeRole(Roles.Teacher);
              }}
            >
              teacher
            </Button>
            <Button
              onClick={() => {
                becomeRole("unauthenticated");
              }}
            >
              unauthenticated
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
