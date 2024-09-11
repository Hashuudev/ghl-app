"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoadingOrSuccessAnimationModal = ({
  show,
  loading,
  success,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-40">
      <div className="bg-[#1C1C1E] rounded-lg py-14 px-12 w-full max-w-[700px] relative">
        {loading && (
          <div className="text-center">
            <div className="h-72">
              <DotLottieReact
                src="/assets/loading_animation.lottie"
                loop={false}
                autoplay
                speed={0.3}
              />
            </div>
            <p className="text-white mb-8">
              Please Wait Employee is in process
            </p>
          </div>
        )}
        {success && (
          <div className="text-center">
            <div className="h-72">
              <DotLottieReact
                src="/assets/success_animation.lottie"
                loop={false}
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
};

export default LoadingOrSuccessAnimationModal;
