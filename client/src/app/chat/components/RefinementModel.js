import { useState } from "react";

const RefinementSidePanel = ({ isVisible, onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    onSubmit(feedback);
    setFeedback("");
    onClose();
  };

  if (isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-end z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      ></div>

      {/* Side panel */}
      <div className="relative bg-[#242922] w-full max-w-md h-full shadow-lg p-6 transition-transform transform translate-x-0">
        <h2 className="text-xl font-semibold text-white mb-4">
          Refine the Prompt
        </h2>
        <p className="text-sm text-gray-300 mb-2">Don’t Like This Response:</p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What didn’t you like about the response?"
          className="w-full h-24 p-2 mb-4 text-sm border border-gray-700 rounded bg-gray-800 text-white"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#29c163] text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefinementSidePanel;
