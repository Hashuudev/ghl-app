import { useMutation } from "@tanstack/react-query";

const createAIEmployee = async ({
  locationId,
  generatedPrompt,
  industryId,
  userAnswers, // Send answers as an array
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/customValue/manageCustomValue/${locationId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "OpenAi Prompt",
        value: generatedPrompt,
        userAnswers,
        industryId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create Ai Employee");
  }

  return response.json();
};

export const useCreateAIEmployee = () => {
  return useMutation({
    mutationKey: "createAiEmploye",
    mutationFn: createAIEmployee,
  });
};
