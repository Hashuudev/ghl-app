import { useMutation } from "@tanstack/react-query";

const claudeRequest = async (message, previousMessages, onChunk) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/aiChat/claude`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: [...previousMessages, message] }),
    }
  );

  if (!response.ok) {
    console.log(response);
    throw new Error("Error with Claude request");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulatedResponse = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = JSON.parse(line.slice(6));
        if (data.type === "content") {
          accumulatedResponse += data.text;

          onChunk(data.text);
        } else if (data.type === "error") {
          throw new Error(data.message);
        }
      }
    }
  }

  return {
    role: "assistant",
    content: [{ type: "text", text: accumulatedResponse }],
  };
};

export const useClaudeRequest = () => {
  return useMutation({
    mutationKey: ["claudeRequest"],
    mutationFn: ({ message, previousMessages, onChunk }) =>
      claudeRequest(message, previousMessages, onChunk),
  });
};
