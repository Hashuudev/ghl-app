"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader2, Send } from "lucide-react";
import { useChatGPTRequest } from "../hooks/useChatGptRequest";
import { useClaudeRequest } from "../hooks/useClaudeRequest";
import Markdown from "react-markdown";
import { BiDislike } from "react-icons/bi";
import RefinementModal from "./components/RefinementModel";

// Define the Models Enum-like object
const Models = Object.freeze({
  CHATGPT: "chatgpt",
  CLAUDE: "claude",
});

export default function Chat() {
  const [activeModel, setActiveModel] = useState(Models.CHATGPT); // Use Models object here
  const [messages, setMessages] = useState({
    [Models.CHATGPT]: [],
    [Models.CLAUDE]: [],
  });
  const [gptThreadId, setGptThreadId] = useState(null);
  const [input, setInput] = useState("");
  const [streamingMessage, setStreamingMessage] = useState(""); // Keep track of the ongoing Claude AI stream
  const [isStreaming, setIsStreaming] = useState(false); // Track if streaming is happening
  const [showToast, setShowToast] = useState(false); // Control toast notification
  const [promptMessageIndex, setPromptMessageIndex] = useState(null);
  const [testMessageIndex, setTestMessageIndex] = useState(null);
  const [refinementMessageIndices, setRefinementMessageIndices] = useState([]); // To track multiple indices

  // State to handle modal visibility
  const [isRefinementModalVisible, setRefinementModalVisible] = useState(false);
  // Track the index of the message with the prompt
  const messagesEndRef = useRef(null);
  const [generatedPrompt, setGeneratedPrompt] = useState(""); // Track the generated prompt

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Use ChatGPT and Claude hooks
  const { mutate: sendChatGPTMessage, isLoading: isChatGPTLoading } =
    useChatGPTRequest();
  const { mutate: sendClaudeMessage, isLoading: isClaudeLoading } =
    useClaudeRequest();

  const isLoading = isChatGPTLoading || isClaudeLoading;

  // Handle the form submission
  const handleSubmit = (e) => {
    let streamedResponse = "";
    e?.preventDefault();
    if (!input.trim()) return;

    // Set streaming to true
    setIsStreaming(true);

    // Send message to either model
    const newMessage = {
      role: "user",
      content: [{ type: "text", text: input }],
    };

    setMessages((prev) => ({
      ...prev,
      [activeModel]: [...prev[activeModel], newMessage],
    }));
    setInput("");

    if (activeModel === Models.CHATGPT) {
      sendChatGPTMessage(
        {
          message: newMessage.content[0].text,
          threadId: gptThreadId,
          setThreadId: setGptThreadId,
          onChunk: (chunk) => {
            streamedResponse += chunk;
            setStreamingMessage(streamedResponse);
          },
        },
        {
          onSuccess: () => {
            setMessages((prev) => ({
              ...prev,
              [Models.CHATGPT]: [
                ...prev[Models.CHATGPT],
                {
                  role: "system",
                  content: [{ type: "text", text: streamedResponse }],
                },
              ],
            }));

            // Detect the generated prompt from the streamed response
            handlePromptDetection(streamedResponse, (prompt) => {
              setGeneratedPrompt(prompt);
              // Set the index of the message that contains the prompt
              setPromptMessageIndex(messages[activeModel].length + 1);
            });

            // Clear streaming message
            setStreamingMessage("");
            setIsStreaming(false); // Set streaming to false when done
          },
          onError: () => {
            setMessages((prev) => ({
              ...prev,
              [Models.CHATGPT]: [
                ...prev[Models.CHATGPT],
                {
                  role: "system",
                  content: [
                    { type: "text", text: "Error processing your request" },
                  ],
                },
              ],
            }));
            setIsStreaming(false); // Set streaming to false on error
          },
        }
      );
    } else if (activeModel === Models.CLAUDE) {
      sendClaudeMessage(
        {
          message: newMessage,
          previousMessages: messages[Models.CLAUDE],
          onChunk: (chunk) => {
            streamedResponse += chunk;
            setStreamingMessage(streamedResponse);
          },
        },
        {
          onSuccess: () => {
            setMessages((prev) => ({
              ...prev,
              [Models.CLAUDE]: [
                ...prev[Models.CLAUDE],
                {
                  role: "assistant",
                  content: [{ type: "text", text: streamedResponse }],
                },
              ],
            }));
            handlePromptDetection(streamedResponse, (prompt) => {
              setGeneratedPrompt(prompt);
              // Set the index of the message that contains the prompt
              setPromptMessageIndex(messages[activeModel].length + 1);
            });
            setStreamingMessage("");
            setIsStreaming(false); // Set streaming to false when done
          },
          onError: (error) => {
            setMessages((prev) => ({
              ...prev,
              [Models.CLAUDE]: [
                ...prev[Models.CLAUDE],
                {
                  role: "system",
                  content: [{ type: "text", text: `Error: ${error.message}` }],
                },
              ],
            }));
            setIsStreaming(false); // Set streaming to false on error
          },
        }
      );
    }
  };

  // Function to handle model switch
  const handleModelSwitch = (model) => {
    if (isStreaming) {
      setShowToast(true); // Show toast if trying to switch during streaming
      setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
      return;
    }
    setActiveModel(model);
  };

  // Handle clicking the Test button
  const handleTestClick = () => {
    const testMessage =
      "Let's test the generated prompt. You act as the chatbot, I will act as a customer. You send the first message and don't reveal that you are AI until someone wants to refine the prompt.";
    setTestMessageIndex(messages[activeModel].length);

    let streamedResponse = "";

    // Set streaming to true
    setIsStreaming(true);

    // Create test message
    const newMessage = {
      role: "user",
      content: [{ type: "text", text: testMessage }],
    };

    setMessages((prev) => ({
      ...prev,
      [activeModel]: [...prev[activeModel], newMessage],
    }));

    if (activeModel === Models.CHATGPT) {
      sendChatGPTMessage(
        {
          message: testMessage,
          threadId: gptThreadId,
          setThreadId: setGptThreadId,
          onChunk: (chunk) => {
            streamedResponse += chunk;
            setStreamingMessage(streamedResponse);
          },
        },
        {
          onSuccess: () => {
            setMessages((prev) => ({
              ...prev,
              [Models.CHATGPT]: [
                ...prev[Models.CHATGPT],
                {
                  role: "system",
                  content: [{ type: "text", text: streamedResponse }],
                },
              ],
            }));

            handlePromptDetection(streamedResponse, (prompt) => {
              setGeneratedPrompt(prompt);
              setPromptMessageIndex(messages[activeModel].length + 1);
            });

            setStreamingMessage("");
            setIsStreaming(false); // Set streaming to false when done
          },
          onError: () => {
            setMessages((prev) => ({
              ...prev,
              [Models.CHATGPT]: [
                ...prev[Models.CHATGPT],
                {
                  role: "system",
                  content: [
                    { type: "text", text: "Error processing your request" },
                  ],
                },
              ],
            }));
            setIsStreaming(false); // Set streaming to false on error
          },
        }
      );
    } else if (activeModel === Models.CLAUDE) {
      sendClaudeMessage(
        {
          message: newMessage,
          previousMessages: messages[Models.CLAUDE],
          onChunk: (chunk) => {
            streamedResponse += chunk;
            setStreamingMessage(streamedResponse);
          },
        },
        {
          onSuccess: () => {
            setMessages((prev) => ({
              ...prev,
              [Models.CLAUDE]: [
                ...prev[Models.CLAUDE],
                {
                  role: "assistant",
                  content: [{ type: "text", text: streamedResponse }],
                },
              ],
            }));
            handlePromptDetection(streamedResponse, (prompt) => {
              setGeneratedPrompt(prompt);
              setPromptMessageIndex(messages[activeModel].length + 1);
            });
            setStreamingMessage("");
            setIsStreaming(false); // Set streaming to false when done
          },
          onError: (error) => {
            setMessages((prev) => ({
              ...prev,
              [Models.CLAUDE]: [
                ...prev[Models.CLAUDE],
                {
                  role: "system",
                  content: [{ type: "text", text: `Error: ${error.message}` }],
                },
              ],
            }));
            setIsStreaming(false); // Set streaming to false on error
          },
        }
      );
    }
  };

  const handleRefinePrompt = (feedback) => {
    let streamedResponse = "";

    // Prepare new prompt with feedback
    const refinedPrompt = `Refine the prompt based on the following feedback and continue the conversation without returning updated prompt or from where we left: ${feedback}`;

    // Set streaming to true
    setIsStreaming(true);

    const newMessage = {
      role: "user",
      content: [{ type: "text", text: refinedPrompt }],
    };

    setRefinementMessageIndices((prevIndices) => [
      ...prevIndices,
      messages[activeModel].length, // Assuming messages is an array of your current messages
    ]);
    console.log(refinementMessageIndices);

    setMessages((prev) => ({
      ...prev,
      [activeModel]: [...prev[activeModel], newMessage],
    }));
    if (activeModel === Models.CHATGPT) {
      sendChatGPTMessage(
        {
          message: refinedPrompt,
          threadId: gptThreadId,
          setThreadId: setGptThreadId,
          onChunk: (chunk) => {
            streamedResponse += chunk;
            setStreamingMessage(streamedResponse);
          },
        },
        {
          onSuccess: () => {
            setMessages((prev) => ({
              ...prev,
              [Models.CHATGPT]: [
                ...prev[Models.CHATGPT],
                {
                  role: "system",
                  content: [{ type: "text", text: streamedResponse }],
                },
              ],
            }));
            handlePromptDetection(streamedResponse, (prompt) => {
              setGeneratedPrompt(prompt);
              setPromptMessageIndex(messages[activeModel].length + 1);
            });
            setStreamingMessage("");
            setIsStreaming(false);
          },
          onError: () => {
            setMessages((prev) => ({
              ...prev,
              [Models.CHATGPT]: [
                ...prev[Models.CHATGPT],
                {
                  role: "system",
                  content: [
                    { type: "text", text: "Error processing your request" },
                  ],
                },
              ],
            }));
            setIsStreaming(false);
          },
        }
      );
    } else if (activeModel === Models.CLAUDE) {
      sendClaudeMessage(
        {
          message: newMessage,
          previousMessages: messages[Models.CLAUDE],
          onChunk: (chunk) => {
            streamedResponse += chunk;
            setStreamingMessage(streamedResponse);
          },
        },
        {
          onSuccess: () => {
            setMessages((prev) => ({
              ...prev,
              [Models.CLAUDE]: [
                ...prev[Models.CLAUDE],
                {
                  role: "assistant",
                  content: [{ type: "text", text: streamedResponse }],
                },
              ],
            }));
            handlePromptDetection(streamedResponse, (prompt) => {
              setGeneratedPrompt(prompt);
              setPromptMessageIndex(messages[activeModel].length + 1);
            });
            setStreamingMessage("");
            setIsStreaming(false);
          },
          onError: (error) => {
            setMessages((prev) => ({
              ...prev,
              [Models.CLAUDE]: [
                ...prev[Models.CLAUDE],
                {
                  role: "system",
                  content: [{ type: "text", text: `Error: ${error.message}` }],
                },
              ],
            }));
            setIsStreaming(false);
          },
        }
      );
    }
  };

  // Functions to show and hide the modal
  const showRefinementModal = () => setRefinementModalVisible(true);
  const hideRefinementModal = () => setRefinementModalVisible(false);

  // Function to handle feedback submission
  const handleFeedbackSubmit = (feedback) => {
    handleRefinePrompt(feedback);
  };
  return (
    <div className="flex flex-col min-h-screen bg-[#131619] text-white">
      <RefinementModal
        isVisible={isRefinementModalVisible}
        onClose={hideRefinementModal}
        onSubmit={handleFeedbackSubmit}
      />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 p-6">
        {/* Chat Section */}
        <div className="bg-[#1F2329] rounded-xl p-6">
          <div
            ref={messagesEndRef}
            className="relative h-[600px] overflow-auto"
          >
            <div className="grid gap-4">
              {messages[activeModel].map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${
                    message.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.role === "user" ? (
                    index !== testMessageIndex &&
                    !refinementMessageIndices.includes(index) && (
                      <>
                        <div
                          className={`${
                            index === promptMessageIndex
                              ? "bg-[#F0E68C]" // Different background color for prompt message
                              : "bg-[#B6F09C]"
                          } text-[#131619] rounded-lg p-4 max-w-[80%]`}
                        >
                          <Markdown>{message.content[0].text}</Markdown>
                        </div>
                        <span className="relative flex items-center justify-center shrink-0 overflow-hidden rounded-full w-8 h-8 border-2 border-[#B6F09C]">
                          JD
                        </span>
                      </>
                    )
                  ) : (
                    <>
                      <span className="relative flex items-center justify-center shrink-0 overflow-hidden rounded-full w-8 h-8 border-2 border-[#B6F09C]">
                        IQ
                      </span>
                      <div
                        className={`${
                          index === promptMessageIndex
                            ? "bg-[#2A3038]" // Different background color for prompt message
                            : "bg-[#2A3038]"
                        } rounded-lg p-4 max-w-[80%]`}
                      >
                        <Markdown>{message.content[0].text}</Markdown>

                        {generatedPrompt && (
                          <div className="message-reacts mt-3 flex items-center gap-2 justify-end">
                            {index === promptMessageIndex && (
                              <span className="genrated-prompt bg-[#b6f09c] text-black px-2 py-1 rounded-sm inline-block ">
                                Generated PROMPT
                              </span>
                            )}
                            <div
                              onClick={() => {
                                showRefinementModal(index);
                              }}
                              className="cursor-pointer"
                            >
                              <BiDislike />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
              {streamingMessage && (
                <>
                  <span className="relative flex items-center justify-center shrink-0 overflow-hidden rounded-full w-8 h-8 border-2 border-[#B6F09C]">
                    IQ
                  </span>
                  <div className="bg-[#2A3038] rounded-lg p-4 max-w-[80%]">
                    <Markdown>{streamingMessage}</Markdown>
                  </div>
                </>
              )}
              {isLoading && (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin" />
                </div>
              )}
              <div />
            </div>
          </div>

          {/* Input Box */}
          <div className="relative mt-4">
            <textarea
              className="w-full p-4 bg-[#2A3038] text-white rounded-lg border-none resize-none"
              placeholder="Type your message..."
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              className="absolute flex items-center justify-center top-1/2 right-4 transform -translate-y-1/2 h-10 w-10 bg-[#B6F09C] text-[#131619] rounded-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-[#1F2329] rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Settings</h2>
          <div className="grid gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">AI Model</h3>
              <div className="flex gap-2">
                <button
                  className={`inline-flex items-center justify-center text-sm font-medium rounded-md px-3 h-9 ${
                    activeModel === Models.CHATGPT
                      ? "bg-[#B6F09C] text-[#131619]"
                      : "bg-[#2A3038]"
                  }`}
                  onClick={() => handleModelSwitch(Models.CHATGPT)}
                  disabled={isLoading}
                >
                  Chat GPT
                </button>
                <button
                  className={`inline-flex items-center justify-center text-sm font-medium rounded-md px-3 h-9 ${
                    activeModel === Models.CLAUDE
                      ? "bg-[#B6F09C] text-[#131619]"
                      : "bg-[#2A3038]"
                  }`}
                  onClick={() => handleModelSwitch(Models.CLAUDE)}
                  disabled={isLoading}
                >
                  Claude
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {/* Test Button */}
              <button
                className={`inline-flex items-center justify-center text-sm font-medium rounded-md px-3 h-9 ${
                  generatedPrompt
                    ? "bg-[#B6F09C] text-[#131619]"
                    : "bg-[#2A3038] text-gray-400"
                }`}
                disabled={!generatedPrompt || isStreaming} // Disable if prompt is not generated or during streaming
                onClick={handleTestClick} // Trigger test message sending on click
              >
                Test
              </button>
            </div>

            <div className="prompt-container h-[500px] overflow-auto">
              <Markdown>{generatedPrompt}</Markdown>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-[#2A3038] text-white p-4 rounded-md shadow-lg">
          You can't switch models during a response!
        </div>
      )}
    </div>
  );
}

const handlePromptDetection = (response, setGeneratedPrompt) => {
  // Define the markers that indicate a prompt has been built
  const promptStart = "PROMPT BUILT BY IQ BOT";
  const promptEnd = "BUILT BY IQ BOT FOR ZC EMPLOYEE";

  // Check if the response contains the required prompt markers
  if (response.includes(promptStart) && response.includes(promptEnd)) {
    // Find the indices of the start and end markers
    const startIndex = response.indexOf(promptStart) + promptStart.length;
    const endIndex = response.indexOf(promptEnd);

    // Extract the prompt between the markers
    const extractedPrompt = response.substring(startIndex, endIndex).trim();

    // Store the extracted prompt in the state
    setGeneratedPrompt(extractedPrompt);
  }
};
