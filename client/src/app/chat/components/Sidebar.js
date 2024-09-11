// Sidebar.js
import React from "react";
import {
  MessageSquare,
  Home,
  MessageCircle,
  Info,
  MessageCirclePlus,
  MessageCircleCode,
  ArrowLeftFromLineIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DotFilledIcon, DotIcon } from "@radix-ui/react-icons";
import { GoDotFill } from "react-icons/go";
import { useChatContext } from "../context/ChatContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Sidebar = () => {
  const { generatedPrompt } = useChatContext();
  const router = useRouter();
  return (
    <div className="w-16 bg-muted flex flex-col items-center py-4 ">
      <div className="mb-8">
        <ArrowLeftFromLineIcon
          onClick={() => {
            router.replace("/");
          }}
          className="h-8 w-8 text-primary cursor-pointer"
        />
      </div>
      <div className="flex-grow flex flex-col space-y-8">
        <Link href="/chat" variant="ghost" size="icon">
          <Home className="h-5 w-5" />
        </Link>
        <Link
          href="/chat/prompt"
          variant="ghost"
          size="icon"
          className="relative"
        >
          {generatedPrompt && (
            <GoDotFill
              size={15}
              color="red"
              className="absolute top-0 right-[-10px]"
            />
          )}
          <Info className="h-5 w-5" />
        </Link>
        <Link href="/chat/test" variant="ghost" size="icon">
          <MessageCircleCode className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};
