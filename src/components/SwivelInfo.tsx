import React, { useState, useEffect } from "react";

const SwivelInfo = ({
  texts,
  interval = 2000,
}: {
  texts: string[];
  interval: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsAnimating(false);
      }, 500); // This timeout matches the transition duration
    }, interval);

    return () => clearInterval(rotationInterval);
  }, [texts, interval]);

  return (
    <div className="overflow-hidden flex justify-center items-center h-16 text-2xl mt-10">
      <div
        style={{
          transition: "transform 0.5s ease",
          transform: isAnimating ? "translateY(-200%)" : "translateY(0)",
        }}
      >
        {texts[currentIndex]}
      </div>
    </div>
  );
};

export default SwivelInfo;
