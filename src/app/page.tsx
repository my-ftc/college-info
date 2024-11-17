"use client";

import Header from "@components/Header";
import questionnaireData from "@app/data/questionnaire-data.json";
import imageCollegeMapping from "@app/data/logo-college-mapping.json";
import { useEffect, useState } from "react";
import { UpArrowIcon, ArrowIcon } from "./utils/commonIcons";
import ChatUI from "@components/ChatUI";
import SwivelInfo from "@components/SwivelInfo";
import OpenAI from "openai";
import Footer from "@components/Footer";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@firebase/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const texts = [
    "Looking at MBA/PGDM admissions?",
    "Get all your answers here. Instantly.",
  ];
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [threadId1, setThreadId1] = useState<string | null>(null);
  const [threadId2, setThreadId2] = useState<string | null>(null);
  const logos = Array.from({ length: 20 }, (_, i) => `${i + 1}.png`);
  const [randomQuestions, setRandomQuestions] = useState<string[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const router = useRouter();

  const openAI = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_CHATGPT_API_KEY!,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 4) % logos.length);
      }, 500); // Transition duration
    }, 5000);

    return () => clearInterval(intervalId);
  }, [logos.length]);

  const [questionCount, setQuestionCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return parseInt(
        localStorage.getItem("kollegeAIQuestionCount") || "0",
        10
      );
    }
    return 0; // Fallback for SSR
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Replace with actual authentication logic
  const [isRestricted, setIsRestricted] = useState<boolean>(false);

  // Load state from localStorage when the component mounts
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      let savedLoginStatus = true;
      if (user) {
        savedLoginStatus = true;
      } else {
        savedLoginStatus = false;
      }

      setIsLoggedIn(savedLoginStatus);
      setIsRestricted(questionCount >= 2 && !savedLoginStatus);
    });
  }, []);

  // Update localStorage whenever questionCount changes
  useEffect(() => {
    localStorage.setItem("kollegeAIQuestionCount", questionCount.toString());
  }, [questionCount]);

  const handleCarouselScroll = (direction: "left" | "right") => {
    setCurrentIndex((prevIndex) => {
      if (direction === "right") {
        return (prevIndex + 4) % logos.length;
      } else {
        return (prevIndex - 4 + logos.length) % logos.length; // Ensure it wraps around
      }
    });
  };

  const visibleLogos = logos
    .slice(currentIndex, currentIndex + 4)
    .concat(logos.slice(0, Math.max(0, currentIndex + 4 - logos.length)));

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
    if (isRestricted) {
      const message =
        "You have reached the limit of questions. Please log in to ask more.";
      return Promise.resolve(message);
    }

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    // Restrict if the user reaches 2 questions and is not logged in
    if (newCount > 2 && !isLoggedIn) {
      setIsRestricted(true);
      const message =
        "You have reached the limit of questions. Please log in to ask more.";
      return Promise.resolve(message);
    }

    void fetch("/api/insertQuery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message }),
    }).catch((error) => {
      console.error("Error calling insertQuery API:", error);
    });

    let currentThreadId1 = threadId1;
    let currentThreadId2 = threadId2;

    // Create threads if they don't exist
    if (!currentThreadId1) {
      const thread1 = await openAI.beta.threads.create();
      currentThreadId1 = thread1.id;
      setThreadId1(thread1.id);
    }
    if (!currentThreadId2) {
      const thread2 = await openAI.beta.threads.create();
      currentThreadId2 = thread2.id;
      setThreadId2(thread2.id);
    }

    // Send message to both assistants in parallel
    await Promise.all([
      openAI.beta.threads.messages.create(currentThreadId1, {
        role: "user",
        content: message,
      }),
      openAI.beta.threads.messages.create(currentThreadId2, {
        role: "user",
        content: message,
      }),
    ]);

    // Create runs for both assistants in parallel
    const [run1, run2] = await Promise.all([
      openAI.beta.threads.runs.create(currentThreadId1, {
        assistant_id: process.env.NEXT_PUBLIC_ASSISTANT_ID_1!,
      }),
      openAI.beta.threads.runs.create(currentThreadId2, {
        assistant_id: process.env.NEXT_PUBLIC_ASSISTANT_ID_2!,
      }),
    ]);

    // Wait for both runs to complete in parallel
    await Promise.all([
      checkStatus(currentThreadId1, run1.id),
      checkStatus(currentThreadId2, run2.id),
    ]);

    // Get messages from both threads in parallel
    const [messages1, messages2] = await Promise.all([
      openAI.beta.threads.messages.list(currentThreadId1),
      openAI.beta.threads.messages.list(currentThreadId2),
    ]);

    // Combine responses
    const response1: string = (messages1 as any).data[0].content[0].text.value;
    const response2: string = (messages2 as any).data[0].content[0].text.value;

    const response2Parts = response2.split("</a>");
    const modifiedResponse2 = response2Parts.slice(0, -1).join("</a>");

    return `${response1}\n\n${modifiedResponse2}</a>`;
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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 480px)");

    const handleResize = () => {
      setIsSmallScreen(mediaQuery.matches);
    };

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-latoRegular">
      <Header onStartNew={handleStartNew} showNewChat={true} />
      {isRestricted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Limit Reached
            </h2>
            <p className="mt-4 text-gray-600">
              You have reached the limit of questions you can ask KollegeAI
              without logging in.
            </p>
            <p className="mt-2 text-gray-600">
              Please log in to continue asking questions.
            </p>
            <button
              onClick={() => router.push("/auth")} // Replace with your login route
              className="mt-6 px-6 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-700"
            >
              Log In
            </button>
          </div>
        </div>
      )}
      <div className="flex lg:flex-row-reverse flex-grow w-full mt-6 h-full md:flex-col sm:flex-col xs:flex-col">
        {isSmallScreen && (
          <div className="flex flex-col justify-center items-center">
            <b className="text-lg">Apply to our partnered universities</b>
            <div className="relative p-5">
              <div className="flex flex-row items-center rounded-md p-2">
                {/* Left Arrow Button */}
                <button
                  className="flex justify-center items-center w-7 h-7 bg-gray-100 rounded-full hover:bg-gray-300 focus:outline-none"
                  onClick={() => handleCarouselScroll("left")}
                >
                  <ArrowIcon direction="left" />
                </button>

                {/* Carousel Items */}
                <div className="flex flex-row items-center space-x-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                  {visibleLogos.map((logo, index) => {
                    const logoNumber = logo.split(".")[0];
                    const collegeName = imageCollegeMapping.find(
                      (college) => college.file === logoNumber
                    )?.college;
                    return (
                      <div
                        key={index}
                        className="flex flex-row flex-shrink-0 w-20 h-20 p-4 justify-center items-center align-middle rounded-md snap-center"
                      >
                        <img
                          src={`/assets/college-logos/${logo}`}
                          alt={`Logo ${index + 1}`}
                          className="h-20 w-20 object-contain grayscale-0 cursor-pointer"
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

                {/* Right Arrow Button */}
                <button
                  className="flex justify-center items-center w-7 h-7 bg-gray-100 rounded-full hover:bg-gray-300 focus:outline-none"
                  onClick={() => handleCarouselScroll("right")}
                >
                  <ArrowIcon direction="right" />
                </button>
              </div>
            </div>
          </div>
        )}
        {!isSmallScreen && (
          <div className="lg:w-[70%] md:w-full sm:w-full h-auto flex flex-col items-center lg:m-2 md:mt-5 sm:mt-5 lg:pt-0 md:pt-8 sm:pt-8 xs:pt-8 bg-[#F9F9F9] justify-center rounded-lg">
            <b className="lg:text-xl md:text-xl sm:text-xl xs:text-sm">
              Apply to our partnered universities
            </b>
            <div className="grid lg:grid-cols-5 sm:grid-cols-4 md:grid-cols-4 xs:grid-cols-5 gap-4 p-5">
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
                      className="lg:h-20 lg:w-20 md:h-20 md:w-20 sm:h-20 sm:w-20 object-contain grayscale-0 cursor-pointer xs:h-10 xs:w-20"
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
        )}
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
                    <p className="lg:font-bold md:font-bold sm:font-semibold xs:font-thin">
                      {question}
                    </p>
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
      <Footer />
    </div>
  );
}
