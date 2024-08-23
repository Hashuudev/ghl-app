"use client";

import { useState } from "react";
import { useCreateAIEmployee } from "../hooks/useCreateAiEmployee";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function CreateStepComponent({
  questions,
  setStep,
  onClose,
  prompt,
  industryId,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [errors, setErrors] = useState([]);
  const [finalPrompt, setFinalPrompt] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const { mutate, isLoading, isSuccess, isError, error } =
    useCreateAIEmployee();

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;

    setAnswers(updatedAnswers);

    const updatedErrors = [...errors];
    updatedErrors[index] = "";
    setErrors(updatedErrors);
  };

  const validateAnswers = () => {
    const newErrors = [];
    const currentQuestions = questions.slice(currentIndex, currentIndex + 2);

    currentQuestions.forEach((question, index) => {
      if (!answers[currentIndex + index]) {
        newErrors[currentIndex + index] = "This field is required";
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const generatePrompt = () => {
    let updatedPrompt = prompt;

    // Replace placeholders in the prompt with the corresponding values
    questions.forEach((question, index) => {
      const key = question.toLowerCase().replace(/\s+/g, "_");
      const value = answers[index] || `Your ${question}`;
      const regex = new RegExp(`{{ custom_values.${key} }}`, "g");
      updatedPrompt = updatedPrompt.replace(regex, value);
    });

    return updatedPrompt;
  };

  const handleNext = () => {
    if (validateAnswers()) {
      if (currentIndex + 2 < questions.length) {
        setCurrentIndex(currentIndex + 2);
      } else {
        const generatedPrompt = generatePrompt();
        setFinalPrompt(generatedPrompt);
        const { activeLocation } = JSON.parse(localStorage.getItem("userData"));
        const locationId = activeLocation;

        setLoading(true);
        setTimeout(() => {
          mutate(
            {
              locationId,
              industryId,
              userAnswers: answers, // Send answers as an array
              generatedPrompt,
            },
            {
              onSuccess: () => {
                setLoading(false);
                setAnswers([]);
                setCurrentIndex(0);
                setStep("success");
              },
              onError: (error) => {
                console.error("Error:", error);
                setLoading(false);
                setSubmitError(
                  "Failed to submit the prompt. Please try again."
                );
              },
            }
          );
        }, 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <div className="h-72">
          <DotLottieReact
            src="/assets/loading_animation.lottie"
            loop
            autoplay
          />
        </div>
        <span className="text-white text-lg">
          Please Wait Employee is in process
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          Create New AI Employee
        </h2>
        <button
          onClick={() => setStep("initial")}
          className="text-green-400 hover:text-green-600 transition-colors duration-200"
        >
          &#x2190; Back
        </button>
      </div>
      {submitError && <div className="text-red-500 mb-4">{submitError}</div>}
      <div className="mb-6">
        {questions
          .slice(currentIndex, currentIndex + 2)
          .map((question, index) => (
            <div key={index} className="mb-4">
              <label className="block text-white mb-2">{question}</label>
              <input
                type="text"
                value={answers[currentIndex + index] || ""}
                onChange={(e) =>
                  handleAnswerChange(currentIndex + index, e.target.value)
                }
                className={`w-full p-2 border border-gray-300 rounded-lg ${
                  errors[currentIndex + index] ? "border-red-500" : ""
                } bg-[#2A2A2B] text-white transition-colors duration-200`}
              />
              {errors[currentIndex + index] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[currentIndex + index]}
                </p>
              )}
            </div>
          ))}
      </div>
      <div className="flex justify-between">
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex(currentIndex - 2)}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-500"
          >
            Previous
          </button>
        )}
        <button
          onClick={handleNext}
          className="bg-green-400 text-black py-2 px-4 rounded-lg ml-auto transition-colors duration-200 hover:bg-green-300"
        >
          {currentIndex + 2 < questions.length ? "Next" : "Submit"}
        </button>
      </div>
    </>
  );
}
