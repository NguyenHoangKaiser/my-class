import React from "react";

function Footer() {
  return (
    <div className="container mx-auto md:flex md:items-center md:justify-between md:px-6">
      <span className="text-sm text-gray-500 dark:text-gray-50 sm:text-center">
        © 2022 <a className="hover:underline">HUYHOANG</a>. All Rights Reserved.
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
  );
}

export default Footer;
