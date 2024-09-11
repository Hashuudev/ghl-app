"use client";

import Layout from "./components/Layout";
import Header from "./components/Header";
import CardList from "./components/IndustryList";
import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  });

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div class="flex flex-col items-center z-5">
          <h3 className="text-4xl text-white">
            Good things take time just a few more seconds...
          </h3>
          <div class="flex">
            <h3 class="dot text-[200px] text-[#B6F09C] opacity-0 mx-1 relative -top-4 one leading-3">
              .
            </h3>
            <h3 class="dot text-[200px] text-[#B6F09C] opacity-0 mx-1 relative -top-4 two leading-3">
              .
            </h3>
            <h3 class="dot text-[200px] text-[#B6F09C] opacity-0 mx-1 relative -top-4 three leading-3">
              .
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Header />
      <div className="px-10">
        <div className="relative mt-40 mb-20">
          <div
            className="absolute w-96 h-96 mix-blend-lighten rounded-full blur-[200px] right-0"
            style={{
              background:
                "radial-gradient(circle, rgba(3,251,7,1) 0%, rgba(182,240,156,1) 100%)",
            }}
          ></div>
          <h2 className="text-[80px] flex flex-col leading-tight">
            <span>Prebuild</span> <span>AI Employees</span>
          </h2>
        </div>

        <CardList />
      </div>
    </Layout>
  );
}
