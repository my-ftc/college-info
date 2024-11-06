import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="flex justify-evenly items-center w-full p-2 shadow-sm">
      <Link
        href={"/privacy-policy"}
        className="underline text-gray-600 text-sm"
      >
        Privacy Policy
      </Link>
      <Link
        href={"/terms-and-conditions"}
        className="underline text-gray-600 text-sm"
      >
        Terms and Conditions
      </Link>
    </footer>
  );
};

export default Footer;
