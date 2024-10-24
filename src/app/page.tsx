"use client";

import Header from "@components/Header";
import questionnaireData from "@app/data/questionnaire-data.json";
import imageCollegeMapping from "@app/data/logo-college-mapping.json";
import { useEffect, useState } from "react";
import { UpArrowIcon } from "./utils/commonIcons";
import ChatUI from "@components/ChatUI";
import SwivelInfo from "@components/SwivelInfo";
import OpenAI from "openai";

export default function Home() {
  const texts = [
    "Looking at MBA/PGDM admissions?",
    "Get all your answers here. Instantly.",
  ];
  const [randomQuestions, setRandomQuestions] = useState<string[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const logos = Array.from({ length: 21 }, (_, i) => `${i + 1}.png`);

  const openAI = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_CHATGPT_API_KEY!,
    dangerouslyAllowBrowser: true,
  });

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
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const thread = await openAI.beta.threads.create();
      currentThreadId = thread.id;
      setThreadId(thread.id); // Save thread ID in state
    }

    await openAI.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: message,
    });

    const run = await openAI.beta.threads.runs.create(currentThreadId, {
      assistant_id: process.env.NEXT_PUBLIC_ASSISTANT_ID!,
    });

    await checkStatus(currentThreadId, run.id);
    const messages: any = await openAI.beta.threads.messages.list(
      currentThreadId
    );

    return messages.body.data[0].content[0].text.value;
  };

  const checkStatus = async (threadId: string, runId: string) => {
    let isComplete = false;
    while (!isComplete) {
      const runStatus = await openAI.beta.threads.runs.retrieve(
        threadId,
        runId
      );
      if (runStatus.status === "completed") {
        isComplete = true;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
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
      <div className="flex lg:flex-row-reverse flex-grow w-full mt-6 h-full md:flex-col sm:flex-col xs:flex-col">
        <div className="lg:w-[70%] md:w-full sm:w-full h-auto flex flex-col items-center lg:m-2 md:mt-5 sm:mt-5 lg:pt-0 md:pt-8 sm:pt-8 xs:pt-8 bg-[#F9F9F9] justify-center rounded-lg">
          <b className="lg:text-xl md:text-xl sm:text-xl xs:text-sm">
            Apply to our partnered universities
          </b>
          <div className="grid lg:grid-cols-5 sm:grid-cols-4 md:grid-cols-4 xs:grid-cols-6 gap-4 p-5">
            {logos.map((logo, index) => {
              const logoNumber = logo.split(".")[0];
              const collegeName = imageCollegeMapping.find(
                (college) => college.file === logoNumber
              )?.college;

              return (
                <div
                  key={index}
                  className="flex justify-center items-center p-3 border border-gray-200 rounded"
                >
                  <img
                    src={`/assets/college-logos/${logo}`}
                    alt={`Logo ${index + 1}`}
                    className="lg:h-20 lg:w-20 md:h-20 md:w-20 sm:h-20 sm:w-20 object-contain grayscale-0 cursor-pointer xs:h-5 xs:w-5"
                    title={collegeName || "College Logo"}
                    onClick={() => {
                      if (collegeName) {
                        setSelectedQuestion(null);
                        setTimeout(() => {
                          setSelectedQuestion(
                            `Give me an overview of ${collegeName}`
                          );
                          handleSearchSubmit();
                        }, 0);
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:w-[130%] md:w-full sm:w-full max-h-screen flex flex-col justify-center items-center lg:m-4 md:m-0 sm:m-0 mb-10">
          {!selectedQuestion ? (
            <div className="mb-10">
              <SwivelInfo texts={texts} interval={3000} />
              <div className="flex lg:flex-row justify-around gap-3 mb-10 lg:mt-20 md:mt-20 sm:mt-10 xs:mt-10 p-2 md:flex-row sm:flex-col xs:flex-col w-full items-center">
                {randomQuestions.map((question: string, index: number) => (
                  <div
                    key={index}
                    className="bg-white hover:bg-[#F9F9F9] p-6 lg:w-[25%] md:w-[25%] sm:w-[75%] xs:w-[75%] rounded-lg text-center cursor-pointer border-2 lg:min-h-36 md:min-h-36 sm:min-h-36 xs:min-h-20 h-auto inline align-middle"
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
                  placeholder="Start your chat with KollegeAI"
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
            </div>
          ) : (
            <div className="flex flex-col w-full h-full p-0">
              <ChatUI
                selectedQuestion={selectedQuestion}
                onSendMessage={handleSendMessage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
