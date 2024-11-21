"use client";

import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@firebase/firebase";
import Header from "@components/Header";
import IndiaCityStateMapping from "@data/state-city-mapping.json";
import { Alert, Snackbar } from "@mui/material";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [query, setQuery] = useState<string>("");
  const [userPhoto, setUserPhoto] = useState<string | null>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserPhoto(user.photoURL);
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
            phone: response.user?.phone,
            city: response.user?.city,
            state: response.user?.state,
          });

          if (response.user?.city) {
            const stateCode = IndiaCityStateMapping.find(
              (state) => state.name === response.user?.state
            )?.stateCode;

            setQuery(`${response.user?.city} - ${stateCode}`);
          }
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

    if (!editMode) {
      setEditMode(true);
    } else {
      const newErrors: any = {};
      if (!formData.name.trim()) {
        newErrors.name = "Name is required.";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone is required.";
      }
      if (!formData.city.trim()) {
        newErrors.city = "City is required.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const putResponse = await fetch(`/api/profile`, {
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

      if (putResponse.ok) {
        setShowSuccessMessage(true);
        setEditMode(false);
      }
    }
  };

  const handleInputChange = (e: any) => {
    const input = e.target.value;
    setQuery(input);

    if (input) {
      setErrors({ ...errors, city: "" });
      const filtered = IndiaCityStateMapping.flatMap((state) =>
        state.cities.map((city) => ({
          display: `${city.name} - ${state.stateCode}`,
          cityName: city.name,
          stateCode: state.stateCode,
        }))
      )
        .filter((city) =>
          city.cityName.toLowerCase().includes(input.toLowerCase())
        )
        .slice(0, 8); // Limit the results to a maximum of 20;

      setFilteredCities(filtered);

      if (input.includes("-")) {
        const splitQuery = input.split("-");
        const city = splitQuery[0].trim();
        const state = IndiaCityStateMapping.find(
          (state) => state.stateCode === splitQuery[1].trim()
        )?.name;

        if (state) {
          setFormData({ ...formData, city: city, state: state });
        }
      }
    } else {
      setFilteredCities([]);
      setFormData({ ...formData, city: "", state: "" });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen font-latoRegular">
      <Header onStartNew={() => {}} showNewChat={false} />
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-lg mt-10">
        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={6000}
          onClose={() => setShowSuccessMessage(false)}
        >
          <Alert
            onClose={() => setShowSuccessMessage(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Your profile was saved
          </Alert>
        </Snackbar>
        <h1 className="text-xl font-bold mb-6 text-gray-800 items-center w-full flex flex-col">
          My Profile
        </h1>
        {userPhoto && (
          <div className="flex flex-row w-full items-center justify-center mb-4">
            <img
              className="rounded-full w-16 h-16"
              alt={formData.name}
              src={userPhoto}
            />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name<span className="text-red-500"> *</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              disabled={!editMode}
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
              Email<span className="text-red-500"> *</span>
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
              Phone Number<span className="text-red-500"> *</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="Enter your phone number"
              className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } focus:ring-cyan-700 focus:border-cyan-700`}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City <span className="text-red-500"> *</span>
            </label>
            <input
              id="city"
              name="city"
              type="city"
              list="city-options"
              value={query}
              disabled={!editMode}
              onChange={handleInputChange}
              placeholder="Choose your City"
              className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none ${
                errors.city ? "border-red-500" : "border-gray-300"
              } focus:ring-cyan-700 focus:border-cyan-700`}
            />
            <datalist id="city-options">
              {filteredCities.map((city, index) => (
                <option key={index} value={city.display} />
              ))}
            </datalist>
            {errors.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full ${
              !editMode
                ? "bg-cyan-700 hover:bg-cyan-700 focus:ring-cyan-700"
                : "bg-green-700 hover:bg-green-700 focus:ring-green-700"
            }  text-white py-2 px-4 rounded-lg font-medium  focus:outline-none focus:ring-2  focus:ring-offset-2`}
          >
            {!editMode ? "Edit Profile" : "Save Profile"}
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
}
