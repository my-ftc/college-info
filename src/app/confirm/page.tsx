"use client";

import Header from "@components/Header";
import { auth } from "@firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ConfirmPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
      } else {
        router.push("/");
      }
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev: number) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center min-h-screen font-latoRegular">
      <Header onStartNew={() => {}} showNewChat={false} />
      <div className="mt-20">
        <h1 className="text-3xl">
          Thank you for sign up with{" "}
          <span className="text-[rgb(234,51,48)]">KollegeAI</span>
        </h1>
        <div className="w-full flex flex-row items-center justify-center mt-8">
          <h1>
            You will be redirected to the assistant in {countdown} seconds.
          </h1>
        </div>
      </div>
    </div>
  );
}
