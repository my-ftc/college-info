"use client";

import Header from "@components/Header";
import questionnaireData from "@app/data/questionnaire-data.json";
import { useEffect, useState } from "react";
import { UpArrowIcon } from "./utils/commonIcons";
import ChatUI from "@components/ChatUI";
import SwivelInfo from "@components/SwivelInfo";

export default function Home() {
  const texts = [
    "Looking at MBA/PGDM admissions?",
    "Get all your answers here. Instantly.",
  ];
  const [randomQuestions, setRandomQuestions] = useState<string[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const logos = Array.from({ length: 18 }, (_, i) => `${i + 1}.png`);

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
    const chatGPTresponse = await fetch("/api/chatgpt/assistant", {
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
    return formatTextToHTML(data.response);
  };

  const formatTextToHTML = (text: string) => {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formattedText = formattedText.replace(/### (\S+)/g, "**$1**");
    formattedText = formattedText.replace(/\n/g, "<br />");
    formattedText = formattedText.replace(/【\d+:\d+†source】/g, "");
    return formattedText;
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== "") {
      setSelectedQuestion(searchQuery);
    }
  };

  const handleStartNew = () => {
    setSelectedQuestion(null);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-latoRegular">
      <Header onStartNew={handleStartNew} />
      <div className="flex lg:flex-row flex-grow w-full mt-6 h-full md:flex-col-reverse sm:flex-col-reverse">
        <div className="lg:w-[130%] md:w-full sm:w-full max-h-screen flex flex-col justify-center items-center lg:m-4 md:m-0 sm:m-0">
          {!selectedQuestion ? (
            <>
              <SwivelInfo texts={texts} interval={3000} />
              <div className="flex flex-row justify-around gap-3 mb-10 mt-20">
                {randomQuestions.map((question: string, index: number) => (
                  <div
                    key={index}
                    className="bg-white hover:bg-[#F9F9F9] p-6 w-[25%] rounded-lg text-center cursor-pointer border-2"
                    onClick={() => setSelectedQuestion(question)}
                  >
                    <p className="font-bold">{question}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-row w-full items-center gap-2 justify-center mt-10">
                <input
                  type="text"
                  className="w-[70%] h-11 rounded-md border-2 pl-3"
                  placeholder="Start your chat with KollegeGPT"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                />
                <button
                  className="cursor-pointer bg-cyan-700 p-2 rounded-md hover:bg-cyan-900 transition-colors text-white"
                  onClick={handleSearchSubmit}
                >
                  <UpArrowIcon />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col w-full h-full p-0">
              <ChatUI
                selectedQuestion={selectedQuestion}
                onSendMessage={handleSendMessage}
              />
            </div>
          )}
        </div>
        <div className="lg:w-[70%] md:w-full sm:w-full max-h-screen h-auto flex flex-col items-center m-2 md:mt-5 sm:mt-5 lg:pt-0 md:pt-8 sm:pt-8 bg-[#F9F9F9] justify-center rounded-lg">
          <b className="text-xl">Apply to our partnered universities</b>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex justify-center items-center p-3 border border-gray-200 rounded"
              >
                <img
                  src={`/assets/college-logos/${logo}`}
                  alt={`Logo ${index + 1}`}
                  className="h-20 w-20 object-contain grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
