"use client";

import React, { createContext, useContext, useState } from "react";
import { useChatGPTRequest } from "../../hooks/useChatGptRequest";
import { useClaudeRequest } from "../../hooks/useClaudeRequest";
// Models Constants
const Models = Object.freeze({
  CHATGPT: "chatgpt",
  CLAUDE: "claude",
});

// Create context
const ChatContext = createContext();

// Provide context
export const ChatProvider = ({ children }) => {
  const [activeModel, setActiveModel] = useState(Models.CHATGPT);
  const [messages, setMessages] = useState({
    [Models.CHATGPT]: [],
    [Models.CLAUDE]: [],
  });
  const [gptThreadId, setGptThreadId] = useState(null);
  const [input, setInput] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [promptMessageIndex, setPromptMessageIndex] = useState(null);
  const [promptMessageIndices, setPromptMessageIndices] = useState([]);
  const [testMessageIndex, setTestMessageIndex] = useState(null);
  const [refinementMessageIndices, setRefinementMessageIndices] = useState([]);
  const [isRefinementModalVisible, setRefinementModalVisible] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const { mutate: sendChatGPTMessage, isLoading: isChatGPTLoading } =
    useChatGPTRequest();
  const { mutate: sendClaudeMessage, isLoading: isClaudeLoading } =
    useClaudeRequest();

  // Function to handle message sending
  // const sendMessageToModel = (newMessage) => {
  //   let streamedResponse = "";
  //   setIsStreaming(true);

  //   setMessages((prev) => ({
  //     ...prev,
  //     [activeModel]: [...prev[activeModel], newMessage],
  //   }));
  //   if (activeModel === Models.CHATGPT) {
  //     sendChatGPTMessage(
  //       {
  //         message: newMessage.content[0].text,
  //         threadId: gptThreadId,
  //         setThreadId: setGptThreadId,
  //         onChunk: (chunk) => {
  //           streamedResponse += chunk;
  //           setStreamingMessage(streamedResponse);
  //         },
  //       },
  //       {
  //         onSuccess: () => handleSuccess(streamedResponse, Models.CHATGPT),
  //         onError: () =>
  //           handleError("Error processing your request", Models.CHATGPT),
  //       }
  //     );
  //   } else if (activeModel === Models.CLAUDE) {
  //     sendClaudeMessage(
  //       {
  //         message: newMessage,
  //         previousMessages: messages[Models.CLAUDE],
  //         onChunk: (chunk) => {
  //           streamedResponse += chunk;
  //           setStreamingMessage(streamedResponse);
  //         },
  //       },
  //       {
  //         onSuccess: () => handleSuccess(streamedResponse, Models.CLAUDE),
  //         onError: (error) =>
  //           handleError(`Error: ${error.message}`, Models.CLAUDE),
  //       }
  //     );
  //   }
  // };

  const sendMessageToModel = (newMessage) => {
    return new Promise((resolve, reject) => {
      let streamedResponse = "";
      setIsStreaming(true);

      setMessages((prev) => ({
        ...prev,
        [activeModel]: [...prev[activeModel], newMessage],
      }));

      const handleSuccess = (response, model) => {
        setIsStreaming(false);
        setStreamingMessage("");
        setMessages((prev) => ({
          ...prev,
          [model]: [
            ...prev[model],
            { role: "assistant", content: [{ type: "text", text: response }] },
          ],
        }));

        handlePromptDetection(response, (prompt) => {
          setGeneratedPrompt(prompt);
          setPromptMessageIndex(messages[activeModel].length + 1);
          setPromptMessageIndices((prev) => [
            ...prev,
            messages[activeModel].length + 1,
          ]);
        });

        resolve(response);
      };

      const handleError = (errorMessage, model) => {
        setIsStreaming(false);
        setStreamingMessage("");
        setMessages((prev) => ({
          ...prev,
          [model]: [
            ...prev[model],
            {
              role: "assistant",
              content: [{ type: "text", text: errorMessage }],
            },
          ],
        }));
        reject(new Error(errorMessage));
      };

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
            onSuccess: () => handleSuccess(streamedResponse, Models.CHATGPT),
            onError: () =>
              handleError("Error processing your request", Models.CHATGPT),
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
            onSuccess: () => handleSuccess(streamedResponse, Models.CLAUDE),
            onError: (error) =>
              handleError(`Error: ${error.message}`, Models.CLAUDE),
          }
        );
      }
    });
  };
  const handleSuccess = (response, model) => {
    setMessages((prev) => ({
      ...prev,
      [model]: [
        ...prev[model],
        {
          role: model === Models.CHATGPT ? "system" : "assistant",
          content: [{ type: "text", text: response }],
        },
      ],
    }));

    handlePromptDetection(response, (prompt) => {
      setGeneratedPrompt(prompt);
      setPromptMessageIndex(messages[activeModel].length + 1);
    });

    setStreamingMessage("");
    setIsStreaming(false);
  };

  const handleError = (errorMessage, model) => {
    setMessages((prev) => ({
      ...prev,
      [model]: [
        ...prev[model],
        {
          role: model === Models.CHATGPT ? "system" : "assistant",
          content: [{ type: "text", text: errorMessage }],
        },
      ],
    }));
    setIsStreaming(false);
  };

  // Function to reset all context values
  const resetContext = () => {
    setActiveModel(Models.CHATGPT);
    setMessages({
      [Models.CHATGPT]: [],
      [Models.CLAUDE]: [],
    });
    setGptThreadId(null);
    setInput("");
    setStreamingMessage("");
    setIsStreaming(false);
    setShowToast(false);
    setPromptMessageIndex(null);
    setTestMessageIndex(null);
    setRefinementMessageIndices([]);
    setRefinementModalVisible(false);
    setGeneratedPrompt("");
  };
  // Add sendMessageToModel to the context value
  return (
    <ChatContext.Provider
      value={{
        Models,
        activeModel,
        setActiveModel,
        messages,
        setMessages,
        gptThreadId,
        setGptThreadId,
        input,
        setInput,
        streamingMessage,
        setStreamingMessage,
        isStreaming,
        setIsStreaming,
        showToast,
        setShowToast,
        promptMessageIndex,
        setPromptMessageIndex,
        testMessageIndex,
        setTestMessageIndex,
        refinementMessageIndices,
        setRefinementMessageIndices,
        isRefinementModalVisible,
        setRefinementModalVisible,
        generatedPrompt,
        setGeneratedPrompt,
        sendMessageToModel,
        resetContext,
        promptMessageIndices,
        setPromptMessageIndices,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useChatContext = () => useContext(ChatContext);

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
