"use client";

import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@firebase/firebase";
import Header from "@components/Header";

const page = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profileResponse = await fetch(`/api/profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
          }),
        });

        if (profileResponse.ok) {
          const response = await profileResponse.json();
          setFormData({
            email: response.user.email,
            name: response.user.name,
            phone: response.user.phone,
            city: response.user.city,
            state: response.user.state,
          });
        }
      } else {
        router.push("/auth");
      }
    });
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await fetch(`/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
      }),
    });
  };

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-latoRegular">
      <Header onStartNew={() => {}} showNewChat={false} />
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-lg mt-10">
        <h1 className="text-xl font-bold mb-6 text-gray-800 items-center w-full flex flex-col">
          My Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name<span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:ring-cyan-700 focus:border-cyan-700`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={true}
              placeholder="Enter your email"
              className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-cyan-700 focus:border-cyan-700`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-700 focus:border-cyan-700"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-700 focus:border-cyan-700"
            />
          </div>

          {/* State */}
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              State
            </label>
            <input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter your state"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-700 focus:border-cyan-700"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-cyan-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2"
          >
            Save Profile
          </button>
        </form>
      </div>
      <div className="mt-10 w-full max-w-lg px-8">
        <button
          type="submit"
          onClick={async () => {
            await signOut(auth);
          }}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 focus:outline-none"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default page;
