import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import "../app/globals.css";

const LoadingTypewriter = () => {
    const messages = [
        "Researching the sources...",
        "Collating the information...",
        "Finding the right answer...",
    ];

    return (
        <div className="flex justify-start mb-2">
            <div
                className="p-2 rounded-lg text-black flex items-center justify-center"
                style={{ maxWidth: "70%" }}
            >
                <span className="blinking-text">
                    <Typewriter
                        words={messages}
                        loop={0}
                        cursor
                        cursorStyle='|'
                        typeSpeed={50}
                        deleteSpeed={30}
                        delaySpeed={1000}
                    />
                </span>
            </div>
        </div>
    );
};

export default LoadingTypewriter;
