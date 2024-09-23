"use client";

import Header from "@components/Header";
import questionnaireData from "@app/data/questionnaire-data.json";
import { useEffect, useState } from "react";
import { UpArrowIcon } from "./utils/commonIcons";
import ChatUI from "@components/ChatUI";

export default function Home() {
  const [randomQuestions, setRandomQuestions] = useState<string[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  useEffect(() => {
    const randomQuestionsArr: string[] = questionnaireData.map(
      (questionnaireDataObj) => {
        const { categoryQuestions } = questionnaireDataObj;
        const randomIndex = Math.floor(
          Math.random() * categoryQuestions.length
        );
        return categoryQuestions[randomIndex];
      }
    );
    setRandomQuestions(randomQuestionsArr);
  }, [questionnaireData]);

  const handleSendMessage = async (message: string): Promise<string> => {
    const chatGPTresponse = await fetch("/api/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message }),
    });

    if (!chatGPTresponse.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await chatGPTresponse.json();
    return data.response;
  };

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-latoRegular">
      <Header />
      <div className="flex flex-row flex-grow w-full mt-6 h-full">
        <div className="w-[130%] max-h-screen flex flex-col justify-center items-center m-4">
          {!selectedQuestion ? (
            <>
              {/* Question Grid */}
              <div className="flex flex-row justify-around gap-3 mb-10">
                {randomQuestions.map((question: string, index: number) => (
                  <div
                    key={index}
                    className="bg-white hover:bg-[#F9F9F9] p-6 w-[25%] rounded-lg text-center cursor-pointer border-2"
                    onClick={() => {
                      setSelectedQuestion(question);
                    }}
                  >
                    <p className="font-bold">{question}</p>
                  </div>
                ))}
              </div>

              {/* Search Bar */}
              <div className="flex flex-row w-full items-center gap-2 justify-center mt-10">
                <input
                  type="text"
                  className="w-[70%] h-11 rounded-md border-2 pl-3"
                  placeholder="Start your chat with KollegeGPT"
                />
                <button className="cursor-pointer bg-cyan-700 p-2 rounded-md hover:bg-cyan-900 transition-colors text-white">
                  <UpArrowIcon />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col w-full h-full p-0">
              {/* Chat UI */}
              <ChatUI
                selectedQuestion={selectedQuestion}
                onSendMessage={handleSendMessage}
              />
            </div>
          )}
        </div>
        {/*          <SwivelInfo texts={texts} interval={3000} />
        <button className="cursor-pointer bg-cyan-700 p-2 rounded-md w-48 hover:bg-cyan-900 transition-colors mt-7 text-white">
          Start chatting
        </button>*/}
        <div className="w-[70%] max-h-screen flex flex-col items-center m-4 bg-[#F9F9F9] justify-center">
          <p>Apply to our partnered universities</p>
        </div>
      </div>
    </div>
  );
}