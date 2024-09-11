import { useEffect, useState } from "react";

import Image from "next/image";
import coverImage from "../../../public/assets/cover.png";
import greenLightImage from "../../../public/assets/greenlight.png";
import React from "react";
import Marquee from "./Marquee";
import TypingAnimation from "./TypingAnimation";
import Link from "next/link";

const Header = () => {
  const [greeting, setGreeting] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const hours = new Date().getHours();
    let greet = "Hello";
    if (hours < 12) greet = "Morning";
    else if (hours < 18) greet = "Afternoon";
    else greet = "Evening";

    setGreeting(greet);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      // Check if user data is in local storage
      // const storedUserData = localStorage.getItem("userData");
      // if (storedUserData) {
      //   setUserData(JSON.parse(storedUserData));
      // } else {
      const data = await getUserData();
      setUserData(data);
      // Save user data in local storage
      localStorage.setItem("userData", JSON.stringify(data));
      // }
    };

    fetchData();
  }, []);
  const getUserData = async () => {
    const key = await new Promise((resolve) => {
      window.parent.postMessage({ message: "REQUEST_USER_DATA" }, "*");
      window.addEventListener("message", ({ data }) => {
        if (data.message === "REQUEST_USER_DATA_RESPONSE") {
          resolve(data.payload);
        }
      });
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/decrypt-sso`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      }
    );

    const data = await res.json();
    return data;
  };

  const items = [
    "PUT ZC TO WORK IN ANY BUSINESS",
    "NEW WAY TO BUILD AI PROMPTS",
    "BEAT YOUR COMPETITION WITH ZC",
  ];
  return (
    <header className="bg-[#131619] text-white  ">
      <Image
        className="absolute right-0 h-[800px] object-cover w-[45%] rounded-l-xl"
        src={coverImage}
      />
      <Image
        className="absolute left-0 mix-blend-lighten"
        src={greenLightImage}
      />
      <div className="p-10">
        {/* Logo */}
        <h1>Logo</h1>
        {/* Greetings */}
        <div className="flex flex-col gap-36 max-w-[800px] relative z-10 p-10 pt-40">
          <div className="flex flex-col gap-4">
            <h2 className="text-[64px] ">
              {userData?.userName && greeting}{" "}
              <span className="font-bold">
                {userData?.userName.split(" ")[0] || <TypingAnimation />}
              </span>
            </h2>
            <p className="text-[28px] ">
              Let AI Powered ZappyChat Employees 🧠 Take Over Lead
              Qualification, Appointment Booking, and Lead Chasing
            </p>
          </div>
          <div className="flex item-center gap-10">
            <div className="flex flex-col">
              <span>Powered By</span>
              <span className="font-bold">Quantum Hive</span>
            </div>
            <div className="flex gap-3">
              <button className="text-lg  bg-[#B6F09C] text-black py-3 px-6 rounded-xl">
                Create Ai Employee
              </button>
              <Link
                href="/chat"
                className="text-lg  bg-[#fff] text-black py-3 px-6 rounded-xl"
              >
                Custom Build Employee
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto ">
        <Marquee text={items} separator={"."} />
      </div>
    </header>
  );
};

export default Header;
