"use client";
import React from "react";
import { TestArea } from "../components/TestArea";
import { SettingsPanel } from "../components/SettingsPanel";

const PromptUi = () => {
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
      <TestArea />
      <SettingsPanel />
    </>
  );
};

export default PromptUi;
