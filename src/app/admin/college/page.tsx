"use client";

import Header from "@components/Header";
import UploadFileData from "@components/UploadFileData";
import React from "react";

interface Props {}

const page = () => {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-latoRegular">
      <Header onStartNew={() => {}} showNewChat={false} />
      <UploadFileData />
    </div>
  );
};

export default page;
