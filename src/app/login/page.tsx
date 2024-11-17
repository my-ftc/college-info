"use client";

import { GoogleIcon } from "@app/utils/commonIcons";
import Header from "@components/Header";
import React, { useState } from "react";

interface Props {}

const page = () => {
  const [policyChecked, setPolicyChecked] = useState<boolean>(true);
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-latoRegular">
      <Header onStartNew={() => {}} showNewChat={false} />
      <div className="bg-gray-100 min-h-96 w-[30%] mt-20 rounded-lg flex flex-col items-center pt-10">
        <div>
          <h1 className="text-lg font-semibold">Login</h1>
        </div>
        <div className="flex items-center mt-20 w-[90%] ">
          <input
            id="privacy-policy"
            type="checkbox"
            checked={policyChecked}
            onChange={() => {
              setPolicyChecked(!policyChecked);
            }}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="privacy-policy"
            className="ml-2 text-sm text-gray-700"
          >
            By choosing to sign in or login I accept the&nbsp;
            <a href="/privacy-policy" className="text-indigo-600 underline">
              Privacy Policy
            </a>
            &nbsp;and the&nbsp;
            <a
              href="/terms-and-conditions"
              className="text-indigo-600 underline"
            >
              Terms and Condition
            </a>
          </label>
        </div>
        <div className="mt-10 w-full items-center flex flex-col">
          <button
            className="text-black p-4 rounded-lg cursor-pointer border border-gray-800 w-[60%] flex flex-row justify-evenly items-center align-middle disabled:text-gray-600 disabled:bg-gray-200"
            disabled={!policyChecked}
          >
            <GoogleIcon />
            <p>Continue with Google</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
