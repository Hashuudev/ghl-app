import { useMutation } from "@tanstack/react-query";

// Function to make the API request to ChatGPT and handle streaming
const chatGPTRequest = async (message, onChunk, threadId, setThreadId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/aiChat/chatgpt`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message, threadId }),
    }
  );

  if (!response.ok) {
    throw new Error("Error with ChatGPT request");
  }

  // Set up stream reader
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulatedResponse = "";
  let previousChunk = ""; // Store the last chunk to avoid duplication

  // Read the response stream in chunks
  while (true) {
    const { done, value } = await reader.read();
    if (done) break; // Stream finished

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    // Process each line in the chunk
    for (const line of lines) {
      if (line.trim().startsWith("data: ")) {
        // Extract the data payload after "data: "
        const data = line.slice(6);

        try {
          // Parse the JSON content from the stream
          const parsedData = JSON.parse(data);

          if (parsedData.type === "content") {
            // Check if the `text` field is a string or an object
            let text;
            if (typeof parsedData.text === "string") {
              text = parsedData.text;
            } else if (
              typeof parsedData.text === "object" &&
              parsedData.text.value
            ) {
              text = parsedData.text.value; // Handle case when text is an object
            }

            // Prevent double appending by checking if the current chunk is the same as the previous chunk
            if (previousChunk !== text) {
              accumulatedResponse += text;
              previousChunk = text; // Update the previous chunk to the current one

              // Call the onChunk handler to update the UI in real-time
              onChunk(text);
            }
          } else if (parsedData.type === "done") {
            setThreadId(parsedData.threadId);
            break; // End of the stream
          }
        } catch (error) {
          console.error("Error parsing stream data:", error);
        }
      }
    }
  }

  // Return the final accumulated response
  return {
    role: "assistant",
    content: [{ type: "text", text: accumulatedResponse }],
  };
};

// Hook for ChatGPT request with streaming
export const useChatGPTRequest = () => {
  return useMutation({
    mutationKey: ["chatgptRequest"],
    mutationFn: ({ message, onChunk, threadId, setThreadId }) =>
      chatGPTRequest(message, onChunk, threadId, setThreadId),
  });
};
