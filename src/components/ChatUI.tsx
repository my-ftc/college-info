// components/ChatUI.tsx

import React, { useState, useEffect, useRef } from "react";
import questionnaireData from "@app/data/questionnaire-data.json";
import { Message } from "react-chat-ui";
import { CopyIcon, UpArrowIcon } from "../app/utils/commonIcons";

interface ChatUIProps {
  selectedQuestion: string;
  onSendMessage: (message: string) => Promise<string>;
}

const ChatUI: React.FC<ChatUIProps> = ({ selectedQuestion, onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasFetchedInitialMessage = useRef(false);

  useEffect(() => {
    if (hasFetchedInitialMessage.current) return;

    if (selectedQuestion) {
      hasFetchedInitialMessage.current = true;
      const initialMessage = new Message({ id: 1, message: selectedQuestion });
      setMessages([initialMessage]);
      handleInitialMessage(selectedQuestion);
    }
  }, [selectedQuestion]);

  const handleInitialMessage = async (message: string) => {
    try {
      setMessageLoading(true);
      const botResponse = await onSendMessage(message);
      const responseMessage = new Message({ id: 2, message: botResponse });
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = new Message({
        id: 2,
        message: "Sorry, something went wrong.",
      });
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = new Message({ id: 1, message: inputValue });
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue("");

      try {
        setMessageLoading(true);
        const botResponse = await onSendMessage(inputValue);
        const responseMessage = new Message({ id: 2, message: botResponse });
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage = new Message({
          id: 2,
          message: "Sorry, something went wrong.",
        });
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setMessageLoading(false);
      }
    }
  };

  const handleSendMessageFromGeneratedQuestions = async (
    inputQuestion: string
  ) => {
    if (inputQuestion.trim()) {
      const userMessage = new Message({ id: 1, message: inputQuestion });
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {
        setMessageLoading(true);
        const botResponse = await onSendMessage(inputQuestion);
        const responseMessage = new Message({ id: 2, message: botResponse });
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage = new Message({
          id: 2,
          message: "Sorry, something went wrong.",
        });
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setMessageLoading(false);
      }
    }
  };

  const formatTextToHTML = (text: string) => {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formattedText = formattedText.replace(/### (\S+)/g, "<strong>$1</strong>");
    formattedText = formattedText.replace(/\n/g, "<br />");
    formattedText = formattedText.replace(/【\d+:\d+†source】/g, "");
    formattedText = formattedText.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    formattedText = formattedText.replace(
      /<a href="(.*?)">(.*?)<\/a>/g,
      `<a href="$1" target="_blank" rel="noopener noreferrer">
        <button class="bg-cyan-700 hover:bg-cyan-900 text-white py-2 px-3 rounded mt-4">
          Apply to $2
        </button>
      </a>`
    );
    return formattedText;
  };

  const generateQuestions = () => {
    if (!inputValue) {
      const randomQuestionsArr: string[] = questionnaireData.map(
        (questionnaireDataObj) => {
          const { categoryQuestions } = questionnaireDataObj;
          const randomIndex = Math.floor(
            Math.random() * categoryQuestions.length
          );
          return categoryQuestions[randomIndex];
        }
      );
      return randomQuestionsArr;
    } else {
      return [];
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-220px)]">
        {messages.map((msg, index) => {
          if (msg.id === 1) {
            return (
              <div
                key={index}
                className="flex mb-2 justify-end items-end gap-2"
              >
                <div
                  className={`p-4 rounded-lg bg-cyan-700 text-white`}
                  style={{ maxWidth: "70%" }}
                >
                  {msg.message}
                </div>
                <div
                  className="cursor-pointer"
                  onClick={async () => {
                    await navigator.clipboard.writeText(msg.message);
                  }}
                >
                  <CopyIcon />
                </div>
              </div>
            );
          } else {
            if (index === messages.length - 1) {
              return (
                <div key={index}>
                  <div
                    key={index}
                    className={`flex justify-start mt-6 mb-6 items-end gap-2`}
                  >
                    <div
                      className={`p-4 rounded-lg text-black bg-gray-100`}
                      style={{ maxWidth: "100%" }}
                      dangerouslySetInnerHTML={{
                        __html: formatTextToHTML(msg.message),
                      }}
                    />
                    <div
                      className="cursor-pointer"
                      onClick={async () => {
                        await navigator.clipboard.writeText(msg.message);
                      }}
                    >
                      <CopyIcon />
                    </div>
                  </div>
                  <div className="flex lg:flex-row md:flex-row sm:flex-row xs:flex-col justify-around gap-3 mb-10">
                    {generateQuestions().map(
                      (question: string, index: number) => (
                        <div
                          key={index}
                          className="bg-white hover:bg-[#F9F9F9] p-2 lg:w-[25%] md:w-[25%] sm:w-[25%] xs:w-[100%] rounded-lg text-center cursor-pointer border-2"
                          onClick={() => {
                            handleSendMessageFromGeneratedQuestions(question);
                          }}
                        >
                          <p className="font-thin text-sm">{question}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className={`flex justify-start mt-6 mb-6 items-end gap-2`}
                >
                  <div
                    className={`p-4 rounded-lg text-black bg-gray-100`}
                    style={{ maxWidth: "100%" }}
                    dangerouslySetInnerHTML={{
                      __html: formatTextToHTML(msg.message),
                    }}
                  />
                  <div
                    className="cursor-pointer"
                    onClick={async () => {
                      await navigator.clipboard.writeText(msg.message);
                    }}
                  >
                    <CopyIcon />
                  </div>
                </div>
              );
            }
          }
        })}
        {messageLoading && (
          <div className="flex justify-start mb-2">
            <div
              className="p-2 rounded-lg text-black flex items-center justify-center"
              style={{ maxWidth: "70%" }}
            >
              <div className="spinner"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-row w-full items-center gap-2 mt-4 justify-center">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.shiftKey) {
                return;
              } else {
                e.preventDefault();
                handleSendMessage();
              }
            }
          }}
          className="w-[70%] rounded-md border-2 pl-3 resize-none h-auto"
          placeholder="Message KollegeAI"
          disabled={messageLoading}
        />
        <button
          className={`cursor-pointer p-2 rounded-md transition-colors text-white ${
            messageLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-cyan-700 hover:bg-cyan-900"
          }`}
          onClick={handleSendMessage}
          disabled={messageLoading}
        >
          <UpArrowIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
