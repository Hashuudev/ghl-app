"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { useChatContext } from "../context/ChatContext";
import RefinementSidePanel from "./RefinementModel";
import Link from "next/link";

export const ChatArea = () => {
  const {
    messages,
    sendMessageToModel,
    activeModel,
    streamingMessage,
    testMessageIndex,
    refinementMessageIndices,
    setRefinementMessageIndices,
    generatedPrompt,
    resetContext,
    promptMessageIndex,
  } = useChatContext();

  const [inputValue, setInputValue] = useState("");
  const [showRefinementModal, setShowRefinementModal] = useState(false);
  const [disLikeMessage, setDisLikeMessage] = useState("");

  // State to manage predefined prompt
  const scrollViewportRef = useRef(null); // Reference to the scrollable viewport

  // Scroll to bottom whenever messages change
  useEffect(() => {
    console.log();
    if (scrollViewportRef.current) {
      const scrollView = scrollViewportRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      scrollView.scrollTop = scrollView.scrollHeight;
    }
  }, [messages, streamingMessage]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      role: "user",
      content: [{ type: "text", text: inputValue }],
    };

    sendMessageToModel(newMessage);
    setInputValue("");
  };

  const handleSendPredefinedPrompt = () => {
    const newMessage = {
      role: "user",
      content: [{ type: "text", text: "Create Prompt" }],
    };

    sendMessageToModel(newMessage);
  };

  const handleDislikeResponse = (message) => {
    setDisLikeMessage(message);
    setShowRefinementModal(true);
  };

  const handleRefinePrompt = (feedback) => {
    const refineMessagePrompt = {
      role: "user",
      content: [
        {
          type: "text",
          text: `I don't like this response: ${disLikeMessage}. Refine the prompt based on the following feedback and continue the conversation without returning updated prompt or from where we left: ${feedback}`,
        },
      ],
    };

    setRefinementMessageIndices((prevIndices) => [
      ...prevIndices,
      messages[activeModel].length,
    ]);
    sendMessageToModel(refineMessagePrompt);
  };

  const handleRegenratePrompt = () => {
    resetContext();
  };

  return (
    <Card className="flex-1 flex flex-col border-0 rounded-none">
      <RefinementSidePanel
        isVisible={showRefinementModal}
        onClose={() => {
          setShowRefinementModal(false);
          setDisLikeMessage("");
        }}
        onSubmit={handleRefinePrompt}
      />
      <CardHeader className="border-b">
        <h1 className="text-2xl font-bold">Bot IQ</h1>
      </CardHeader>
      <CardContent className="card-content p-0 h-[calc(100vh-150px)]">
        <ScrollArea ref={scrollViewportRef} className="h-full p-4 space-y-4">
          {messages[activeModel].map((message, index) => (
            <React.Fragment key={index}>
              {/* Render the "Test Mode" divider if index matches testMessageIndex */}
              {index === testMessageIndex ? (
                <div className="flex justify-center items-center my-2">
                  <hr className="flex-grow border-t border-gray-300" />
                  <span className="mx-2 text-sm text-gray-500">Test Mode</span>
                  <hr className="flex-grow border-t border-gray-300" />
                </div>
              ) : refinementMessageIndices.includes(index) ? (
                <div className="flex justify-center items-center my-2">
                  <hr className="flex-grow border-t border-gray-300" />
                  <span className="mx-2 text-sm text-gray-500">
                    Refined Response
                  </span>
                  <hr className="flex-grow border-t border-gray-300" />
                </div>
              ) : index === promptMessageIndex ? (
                <ChatMessage
                  message={"Prompt Generated"}
                  isUser={message.role === "user"}
                  isShowDislike={
                    message.role !== "user" &&
                    testMessageIndex != null &&
                    index > testMessageIndex
                  }
                  onDislike={() => {
                    handleDislikeResponse(message.content[0].text);
                  }}
                />
              ) : (
                !refinementMessageIndices.includes(index) &&
                (index < testMessageIndex || testMessageIndex === null) && (
                  <ChatMessage
                    message={message.content[0].text}
                    isUser={message.role === "user"}
                    isShowDislike={
                      message.role !== "user" &&
                      testMessageIndex != null &&
                      index > testMessageIndex
                    }
                    onDislike={() => {
                      handleDislikeResponse(message.content[0].text);
                    }}
                  />
                )
              )}
            </React.Fragment>
          ))}
          {streamingMessage && (
            <ChatMessage message={streamingMessage} isUser={false} />
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        {generatedPrompt ? (
          <div className="flex w-full h-full justify-center items-center   ">
            <Button className="ml-4" onClick={handleRegenratePrompt}>
              Regenerate Prompt
            </Button>
            <Link href="/chat/prompt">
              <Button className="ml-4">See Prompt</Button>
            </Link>
          </div>
        ) : messages[activeModel].length === 0 ? (
          <div className="flex w-full justify-center items-center my-4 p-4 border  rounded-lg ">
            <Button className="ml-4" onClick={handleSendPredefinedPrompt}>
              Create Prompt
            </Button>
          </div>
        ) : (
          <form
            className="flex w-full items-center space-x-2"
            onSubmit={handleSubmit}
          >
            <Input
              type="text"
              placeholder="Type your message..."
              className="flex-1 h-[50px] px-5"
              value={inputValue}
              onChange={handleInputChange}
            />
            <Button type="submit">Send</Button>
          </form>
        )}
      </CardFooter>
    </Card>
  );
};
