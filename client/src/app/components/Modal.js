"use client";

import { useEffect, useState } from "react";
import { useCreateAIEmployee } from "../hooks/useCreateAiEmployee";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { usePreviousAnswers } from "../hooks/usePreviousAnswers";
import { UpdateStepComponent } from "./UpdateStateComponent";
import { InitialStepComponent } from "./InitialStepComponent";
import { CreateStepComponent } from "./CreateStepComponent";

export default function Modal({
  show,
  onClose,
  questions,
  prompt,
  industryId,
}) {
  const [step, setStep] = useState("initial");
  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-40 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-[#1C1C1E] rounded-lg py-14 px-12 w-full max-w-[700px] relative transform transition-transform duration-300 ${
          show ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        }`}
      >
        {step !== "success" && (
          <>
            {step === "initial" && (
              <InitialStepComponent setStep={setStep} onClose={onClose} />
            )}

            {step === "create" && (
              <CreateStepComponent
                questions={questions}
                setStep={setStep}
                prompt={prompt}
                industryId={industryId}
              />
            )}
            {step === "update" && <UpdateStepComponent setStep={setStep} />}
          </>
        )}
        {step == "success" && (
          <div className="text-center">
            <div className="h-72">
              <DotLottieReact
                src="/assets/success_animation.lottie"
                loop
                autoplay
                speed={0.3}
              />
            </div>
            <p className="text-white mb-8">
              Your AI Employee has been created successfully.
            </p>
            <button
              onClick={onClose}
              className="bg-green-400 text-black py-2 px-4 rounded-lg"
            >
              Go Back Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
