"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@firebase/firebase";
import Header from "@components/Header";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

type SignUpData = {
  email: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

const page = () => {
  const [activeTab, setActiveTab] = useState<string>("login"); // Tracks active tab
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: "",
    name: "",
    phone: "",
    city: "",
    state: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [firebaseError, setFirebaseError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      } else {
      }
    });
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setErrors({});
    setFirebaseError("");
  };

  const handleChange = (e: any, type: string) => {
    const { name, value } = e.target;
    if (type === "login") {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setSignUpData({ ...signUpData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
      setFirebaseError("");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newErrors: any = {};
    if (activeTab === "login") {
      if (!loginData.email.trim()) newErrors.email = "Email is required.";
      if (!loginData.password.trim())
        newErrors.password = "Password is required.";
    } else {
      if (!signUpData.name.trim()) newErrors.name = "Name is required.";
      if (!signUpData.email.trim()) newErrors.email = "Email is required.";
      if (!signUpData.password.trim())
        newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      if (activeTab === "login") {
        try {
          const loggedInUser = await signInWithEmailAndPassword(
            auth,
            loginData.email,
            loginData.password
          );

          console.log("Login successful:", loggedInUser.user);
        } catch (error: any) {
          const errorCode = error.code;
          const errorMessage = error.message;

          console.error("Error Code:", errorCode);
          console.error("Error Message:", errorMessage);

          switch (errorCode) {
            case "auth/invalid-email":
              setFirebaseError("Invalid email format.");
              break;
            case "auth/user-not-found":
              setFirebaseError(
                "No user found with this email. Please sign up."
              );
              break;
            case "auth/wrong-password":
              setFirebaseError("Incorrect password.");
              break;
            case "auth/invalid-credential":
              setFirebaseError(
                "No user found with this email. Please sign up."
              );
              break;
            default:
              setFirebaseError("An unknown error occurred.");
          }
        }
      } else {
        try {
          const userCreds = await createUserWithEmailAndPassword(
            auth,
            signUpData.email,
            signUpData.password
          );

          console.log(userCreds);

          await fetch(`/api/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: signUpData.email,
              name: signUpData.name,
              phone: signUpData.phone,
              city: signUpData.city,
              state: signUpData.state,
            }),
          });
        } catch (error: any) {
          const errorCode = error.code;
          const errorMessage = error.message;

          console.error("Error Code:", errorCode);
          console.error("Error Message:", errorMessage);

          switch (errorCode) {
            case "auth/email-already-in-use":
              setFirebaseError(
                "This email is already in use. Please use a different email."
              );
              break;
            case "auth/invalid-email":
              setFirebaseError(
                "Invalid email format. Please check your email."
              );
              break;
            case "auth/weak-password":
              setFirebaseError(
                "The password is too weak. Please choose a stronger password."
              );
              break;
            default:
              setFirebaseError("An unknown error occurred. Please try again.");
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-latoRegular">
      <Header onStartNew={() => {}} showNewChat={false} />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-16">
        <div className="flex justify-between mb-6">
          <button
            onClick={() => handleTabChange("login")}
            className={`w-1/2 py-2 font-semibold rounded-tl-lg ${
              activeTab === "login"
                ? "bg-cyan-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => handleTabChange("signup")}
            className={`w-1/2 py-2 font-semibold rounded-tr-lg ${
              activeTab === "signup"
                ? "bg-cyan-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "login" ? (
            <>
              {/* Login Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => handleChange(e, "login")}
                  placeholder="Enter your email"
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:ring-cyan-500 focus:border-cyan-500`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Login Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => handleChange(e, "login")}
                  placeholder="Enter your password"
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:ring-cyan-500 focus:border-cyan-500`}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Sign Up Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={signUpData.name}
                  onChange={(e) => handleChange(e, "signup")}
                  placeholder="Enter your name"
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:ring-cyan-500 focus:border-cyan-500`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Sign Up Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => handleChange(e, "signup")}
                  placeholder="Enter your email"
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:ring-cyan-500 focus:border-cyan-500`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Sign Up Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={signUpData.password}
                  onChange={(e) => handleChange(e, "signup")}
                  placeholder="Enter your password"
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:ring-cyan-500 focus:border-cyan-500`}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Additional Sign Up Fields */}
              {/* Phone, City, State */}
              {(["phone", "city", "state"] as (keyof SignUpData)[]).map(
                (field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      id={field}
                      name={field}
                      type="text"
                      value={signUpData[field]}
                      onChange={(e) => handleChange(e, "signup")}
                      placeholder={`Enter your ${field}`}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                )
              )}
            </>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-cyan-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          >
            {activeTab === "login" ? "Login" : "Sign Up"}
          </button>
          <div>
            <p className="text-sm text-red-500 mt-1">{firebaseError}</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
