"use client";
import React from "react";
import { Sidebar } from "./components/Sidebar";
import { SettingsPanel } from "./components/SettingsPanel";
import { ChatProvider } from "./context/ChatContext";
import { Toaster } from "@/components/ui/toaster";

const ChatLayout = ({ children }) => {
  return (
    <ChatProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 flex">{children}</div>
        <Toaster />
      </div>
    </ChatProvider>
  );
};

export default ChatLayout;
