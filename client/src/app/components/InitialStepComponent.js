"use client";

import {  useState } from "react";
import { useCreateAIEmployee } from "../hooks/useCreateAiEmployee";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function InitialStepComponent({ setStep, onClose }) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          Create your first sales agent
        </h2>
        <button
          onClick={onClose}
          className="text-black bg-[#B6F09C] w-8 h-8 rounded-full transition-colors duration-200 hover:bg-[#a5e18c]"
        >
          &#x2715;
        </button>
      </div>
      <div className="flex mb-6 bg-[#B6F09C] rounded-xl p-3 gap-3">
        <div
          onClick={() => setStep("create")}
          className="flex flex-col flex-1 items-center p-4 rounded-xl cursor-pointer bg-[#111314] hover:bg-[#1b1b1d] transition-colors duration-200"
        >
          <div className="p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="70"
              height="69"
              viewBox="0 0 70 69"
              fill="none"
            >
              <path
                d="M32.7832 7.95557H65.2832C66.9401 7.95557 68.2832 9.29871 68.2832 10.9556V64.9556C68.2832 66.6124 66.9401 67.9556 65.2832 67.9556H15.7832C14.1264 67.9556 12.7832 66.6124 12.7832 64.9556V38.9556M60.2832 33.4556V42.9556M53.7832 23.4556V53.4556M47.2832 26.9556V49.9556M40.2832 15.4556V61.4556M33.7832 31.4556V45.4556M27.2832 26.9556V49.9556M20.7832 35.4556V41.4556M7.7832 2.45557V9.45557M4.2832 5.95557H11.7832M21.2832 1.45557L25.2832 10.9556L34.7832 14.4556L25.2832 18.4556L21.7832 27.9556L17.7832 18.4556L8.7832 14.9556L17.2832 10.9556L21.2832 1.45557ZM7.7832 20.9556L6.2832 25.4556L1.2832 26.9556L6.2832 29.4556L7.7832 33.9556L10.2832 29.4556L15.2832 27.4556L10.2832 25.4556L7.7832 20.9556Z"
                stroke="#B6F09C"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <span className="text-white text-2xl text-center">
            Create a new AI Employee
          </span>
        </div>
        <div
          onClick={() => setStep("update")}
          className="flex flex-col items-center flex-1 p-4 rounded-lg cursor-pointer bg-[#111314] hover:bg-[#1b1b1d] transition-colors duration-200"
        >
          <div className="p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="71"
              height="71"
              viewBox="0 0 71 71"
              fill="none"
            >
              <path
                d="M43.6729 62.9556H7.67285C4.35914 62.9556 1.67285 60.2693 1.67285 56.9556V18.4556M62.6729 45.9556V18.4556M1.67285 18.4556V7.45557C1.67285 4.14186 4.35914 1.45557 7.67285 1.45557H56.6729C59.9866 1.45557 62.6729 4.14186 62.6729 7.45557V18.4556M1.67285 18.4556H62.6729M7.67285 29.4556H40.6729"
                stroke="#B6F09C"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M7.67285 40.4556H40.6729"
                stroke="#B6F09C"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M7.67285 51.4556H40.6729"
                stroke="#B6F09C"
                stroke-width="2"
                stroke-linecap="round"
              />
              <circle
                cx="14.6729"
                cy="29.4556"
                r="4.5"
                fill="#111314"
                stroke="#B6F09C"
                stroke-width="2"
              />
              <circle
                cx="36.6729"
                cy="9.45557"
                r="2.5"
                stroke="#B6F09C"
                stroke-width="2"
              />
              <circle
                cx="45.6729"
                cy="9.45557"
                r="2.5"
                stroke="#B6F09C"
                stroke-width="2"
              />
              <circle
                cx="54.6729"
                cy="9.45557"
                r="2.5"
                stroke="#B6F09C"
                stroke-width="2"
              />
              <path
                d="M47.6729 37.9556V67.4556L54.6729 64.4556L56.6729 69.4556L65.1729 65.4556L63.1729 60.9556L69.6729 57.9556L47.6729 37.9556Z"
                stroke="#B6F09C"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="36.6729"
                cy="40.4556"
                r="4.5"
                fill="#111314"
                stroke="#B6F09C"
                stroke-width="2"
              />
              <circle
                cx="24.6729"
                cy="51.4556"
                r="4.5"
                fill="#111314"
                stroke="#B6F09C"
                stroke-width="2"
              />
            </svg>
          </div>
          <span className="text-white text-2xl text-center">
            Update existing employee
          </span>
        </div>
      </div>
    </>
  );
}
