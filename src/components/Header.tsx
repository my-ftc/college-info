import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import PersonSharpIcon from "@mui/icons-material/PersonSharp";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import { auth } from "@firebase/firebase";
import Link from "next/link";

interface HeaderProps {
  onStartNew: () => void;
  showNewChat: boolean;
}

const Header: React.FC<HeaderProps> = ({ onStartNew, showNewChat }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<string>("");
  const [userName, setUserName] = useState<string | null>("");
  const [userPhoto, setUserPhoto] = useState<string | null>("");
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserInfo(user.email!);
        setUserPhoto(user.photoURL);
        setUserName(user.displayName);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const handleClick = () => {
    onStartNew();
  };

  return (
    <header className="flex justify-between items-center w-full p-4 bg-gray-100 shadow-sm">
      <Link href={"/"}>
        {" "}
        <img
          src={`/assets/kollegeai/kollege-ai-full.png`}
          className="h-auto w-40 object-contain grayscale-0 cursor-pointer overflow-hidden ml-8"
          title="Kollege AI"
        />
      </Link>

      <div className="relative group mr-4 flex flex-row space-x-3 items-center">
        {isLoggedIn && (
          <div className="flex flex-row space-x-3 items-center">
            <p>Hello, {userName ?? userInfo}</p>
            <Tooltip title={"Profile"}>
              <button
                className="transition-all duration-200 transform hover:scale-125"
                onClick={() => {
                  router.push("/profile");
                }}
              >
                {!userPhoto ? (
                  <PersonSharpIcon />
                ) : (
                  <img
                    className="h-10 w-10 rounded-full"
                    alt={`${userName} display photo`}
                    src={userPhoto}
                  />
                )}
              </button>
            </Tooltip>
            <Tooltip title={"Log Out"}>
              <button
                className="transition-all duration-200 transform hover:scale-125"
                onClick={async () => {
                  await signOut(auth);
                  router.push("/auth");
                }}
              >
                <LogoutSharpIcon />
              </button>
            </Tooltip>
          </div>
        )}
        {!isLoggedIn && (
          <div>
            <button
              className="bg-cyan-700 text-white py-2 px-4 rounded-lg font-medium"
              onClick={() => {
                router.push("/auth");
              }}
            >
              Login
            </button>
          </div>
        )}

        {showNewChat && (
          <Tooltip title={"New Chat"}>
            <button
              className="p-1 rounded-full hover:bg-gray-200 transition-all duration-200 transform hover:scale-125"
              onClick={handleClick}
            >
              <PencilSquareIcon className="w-6 h-6 text-gray-600" />
            </button>
          </Tooltip>
        )}
      </div>
    </header>
  );
};

export default Header;
