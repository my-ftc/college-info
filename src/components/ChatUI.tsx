// components/ChatUI.tsx

import React, { useState, useEffect, useRef } from "react";
import { Message } from "react-chat-ui";
import { UpArrowIcon } from "../app/utils/commonIcons";
import { TypeAnimation } from "react-type-animation";

interface ChatUIProps {
  selectedQuestion: string;
  onSendMessage: (message: string) => Promise<string>;
}

const ChatUI: React.FC<ChatUIProps> = ({ selectedQuestion, onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref to track the end of the message list
  const hasFetchedInitialMessage = useRef(false); // Guard to ensure initial message isn't fetched twice

  // Scroll to the bottom of the chat whenever new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Prevent this effect from running twice in development mode
    if (hasFetchedInitialMessage.current) return;

    if (selectedQuestion) {
      hasFetchedInitialMessage.current = true;
      const initialMessage = new Message({ id: 1, message: selectedQuestion });
      setMessages([initialMessage]);
      handleInitialMessage(selectedQuestion);
    }
  }, [selectedQuestion]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInitialMessage = async (message: string) => {
    try {
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
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const inputValueObj = inputValue;
      setInputValue("");
      const userMessage = new Message({ id: 1, message: inputValueObj });
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {
        const botResponse = await onSendMessage(inputValueObj);
        const responseMessage = new Message({ id: 2, message: botResponse });
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage = new Message({
          id: 2,
          message: "Sorry, something went wrong.",
        });
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-220px)]">
        {messages.map((msg, index) => {
          if (msg.id === 1) {
            return (
              <div key={index} className={`flex justify-end mb-2`}>
                <div
                  className={`p-2 rounded-lg bg-cyan-700 text-white`}
                  style={{ maxWidth: "70%" }}
                >
                  {msg.message}
                </div>
              </div>
            );
          } else {
            return (
              <div key={index} className={`flex justify-start mb-2`}>
                <div
                  className={`p-2 rounded-lg text-black`}
                  style={{ maxWidth: "70%" }}
                  dangerouslySetInnerHTML={{ __html: msg.message }}
                ></div>
              </div>
            );
          }
        })}
        {/* Invisible div to mark the end of the messages */}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-row w-full items-center gap-2 mt-4 justify-center">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.shiftKey) {
                return; // Allow new line
              } else {
                e.preventDefault();
                handleSendMessage();
                setMessageLoading(true);
              }
            }
          }}
          className="w-[70%] h-20 rounded-md border-2 pl-3 resize-none"
          placeholder="Message KollegeGPT"
        />
        <button
          className="cursor-pointer bg-cyan-700 p-2 rounded-md hover:bg-cyan-900 transition-colors text-white disabled:bg-gray-600"
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
