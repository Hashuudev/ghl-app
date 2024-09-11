"use client";

import React, { useState } from "react";
import Card from "./Card";
import Modal from "./Modal"; // Assuming you have a Modal component
import { useIndustries } from "../hooks/useIndustries";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const CardList = () => {
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [industryId, setIndustryId] = useState(null);

  const { data: industries, isLoading, isError, error } = useIndustries();

  const handleCardClick = (industry) => {
    setQuestions(industry.questions);
    setPrompt(industry.openAiPrompt);
    setIndustryId(industry._id);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="w-[300px] h-[300px] mx-auto">
        <DotLottieReact src="/assets/loading_animation.lottie" loop autoplay />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-24 p-4">
        {industries.map((industry) => (
          <Card
            key={industry._id}
            image="/images/card1.jpg" // Static image for now
            industryName={industry.industryName}
            date="12/09/24" // Static date for now
            role="Sales expert" // Assuming 'role' is static for now
            aiName="AI Name" // Assuming 'aiName' is static for now
            onClick={() => handleCardClick(industry)} // Handle card click
          />
        ))}
      </div>

      {showModal && (
        <Modal
          show={showModal}
          questions={questions}
          prompt={prompt}
          industryId={industryId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default CardList;
