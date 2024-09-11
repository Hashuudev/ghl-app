"use client";

import React, { useState } from "react";
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
import Markdown from "react-markdown";

export const PromptArea = () => {
  const { generatedPrompt } = useChatContext();

  return (
    <Card className="flex-1 flex flex-col border-0 rounded-none">
      <CardHeader className="border-b">
        <h1 className="text-2xl font-bold">Bot IQ</h1>
      </CardHeader>
      <CardContent className="card-content p-0 h-[calc(100vh-150px)]">
        <ScrollArea className="h-full p-4 space-y-4">
          {generatedPrompt && <Markdown>{generatedPrompt}</Markdown>}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4"></CardFooter>
    </Card>
  );
};
