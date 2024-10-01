import React, { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid"; // Import pencil icon

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
    if (showNewChat) {
      onStartNew();
    }
  };

  return (
    <header className="flex justify-between items-center w-full p-4 bg-gray-100 shadow-sm">
      <div className="relative group ml-4">
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
        {showNewChat && showTooltip && (
          <span className="absolute left-1/2 top-full mt-2 transform -translate-x-1/2 opacity-100 bg-cyan-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-200">
            New Chat
          </span>
        )}
      </div>

      <h1 className="text-2xl font-extrabold flex justify-center font-latoSemiBold">
        KollegeGPT
      </h1>

      <div className="w-16"></div>
    </header>
  );
};

export default Header;
