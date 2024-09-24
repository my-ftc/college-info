// components/ChatUI.tsx

import React, { useState, useEffect, useRef } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref to track the end of the message list
  const hasFetchedInitialMessage = useRef(false); // Guard to ensure initial message isn't fetched twice
  const textAreaRef = useRef<any>(null);

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
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
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
        if (textAreaRef.current) {
          textAreaRef.current.focus();
        }
      }
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
            return (
              <div
                key={index}
                className={`flex justify-start mt-6 mb-6 items-end gap-2`}
              >
                <div
                  className={`p-4 rounded-lg text-black bg-gray-100`}
                  style={{ maxWidth: "100%" }}
                  dangerouslySetInnerHTML={{ __html: msg.message }}
                ></div>
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
              }
            }
          }}
          className="w-[70%] rounded-md border-2 pl-3 resize-none h-auto"
          placeholder="Message KollegeGPT"
          disabled={messageLoading}
          ref={textAreaRef}
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
