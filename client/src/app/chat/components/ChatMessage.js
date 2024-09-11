import Markdown from "react-markdown";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AiOutlineDislike } from "react-icons/ai";

export const ChatMessage = ({
  message,
  isUser,
  onDislike,
  isShowDislike = false,
}) => (
  <div
    className={`flex flex-col items-start space-x-2 my-2  ${
      isUser ? "items-end" : ""
    }`}
  >
    <div className="max-w-[80%] flex items-start space-x-2">
      {!isUser && (
        <Avatar className="h-[40px] w-[40px] shrink-0">
          <AvatarFallback>IQ</AvatarFallback>
        </Avatar>
      )}
      <Card className={`${isUser ? "bg-primary text-primary-foreground" : ""}`}>
        <CardContent className="p-3">
          <Markdown>{message}</Markdown>
        </CardContent>
      </Card>
      {isUser && (
        <Avatar className="h-[40px] w-[40px] shrink-0">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )}
      {isShowDislike && (
        <button
          onClick={onDislike}
          className="flex self-end p-3 items-center mt-2 text-sm text-red-500 hover:text-red-700"
          aria-label="Dislike"
        >
          <AiOutlineDislike />
        </button>
      )}
    </div>
  </div>
);
