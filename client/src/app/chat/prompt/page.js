"use client";
import React from "react";
import { PromptArea } from "../components/PromptArea";
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
      <PromptArea />
      <SettingsPanel isShowModels={false} />
    </>
  );
};

export default PromptUi;
