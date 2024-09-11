"use client";

import React, { useEffect, useRef, useState } from "react";
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

export const TestArea = () => {
  const {
    messages,
    sendMessageToModel,
    activeModel,
    streamingMessage,
    testMessageIndex,
    refinementMessageIndices,
    setRefinementMessageIndices,
    promptMessageIndices,
    setPromptMessageIndices,
    generatedPrompt,
  } = useChatContext();
  const [inputValue, setInputValue] = useState("");
  const [showRefinementModal, setShowRefinementModal] = useState(false);
  const [disLikeMessage, setDisLikeMessage] = useState("");
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const scrollViewportRef = useRef(null); // Reference to the scrollable viewport
  useEffect(() => {
    console.log();
    if (scrollViewportRef.current) {
      const scrollView = scrollViewportRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      scrollView.scrollTop = scrollView.scrollHeight;
    }
  }, [messages, streamingMessage]);
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
          text: `I dont like this response ${disLikeMessage} Refine the prompt based on the following feedback and continue the conversation without returning updated prompt or from where we left: ${feedback}`,
        },
      ],
    };

    setRefinementMessageIndices((prevIndices) => [
      ...prevIndices,
      messages[activeModel].length,
    ]);
    sendMessageToModel(refineMessagePrompt);
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
              ) : (
                !refinementMessageIndices.includes(index) &&
                !promptMessageIndices.includes(index) &&
                testMessageIndex != null &&
                index > testMessageIndex && (
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
        {generatedPrompt && (
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
