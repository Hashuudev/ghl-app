"use client";
import React from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { PromptArea } from "./components/PromptArea";
import { SettingsPanel } from "./components/SettingsPanel";
import { ChatProvider } from "./context/ChatContext";
import { Toaster } from "@/components/ui/toaster";
import ChatLayout from "./layout";

const ChatUI = () => {
  return (
    // <ChatProvider>
    //   <div className="flex h-screen bg-background text-foreground">
    //     <Sidebar />
    //     <div className="flex-1 flex">
    //       <ChatArea />
    //       <PromptArea />
    //       <SettingsPanel />
    //     </div>
    //   </div>
    // </ChatProvider>
    <>
      <ChatArea />
      <SettingsPanel isShowActions={false} />
    </>
  );
};

export default ChatUI;
