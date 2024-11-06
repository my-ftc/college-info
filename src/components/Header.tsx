import React, { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid"; // Import pencil icon
import Link from "next/link";

interface HeaderProps {
  onStartNew: () => void;
  showNewChat: boolean;
}

const Header: React.FC<HeaderProps> = ({ onStartNew, showNewChat }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    // Hide tooltip after 3 seconds
    setTimeout(() => {
      setShowTooltip(false);
    }, 3000);
  };

  const handleClick = () => {
    setShowTooltip(false);
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

      <div className="relative group mr-4">
        {showNewChat && (
          <button
            className="p-1 rounded-full hover:bg-gray-200 transition-all duration-200 transform group-hover:scale-125"
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
            aria-label="New Chat"
          >
            <PencilSquareIcon className="w-6 h-6 text-gray-600" />
          </button>
        )}
        {showTooltip && showNewChat && (
          <span className="absolute right-1/2 top-full mt-2 transform translate-x-1/2 opacity-100 bg-cyan-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200">
            New Chat
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
