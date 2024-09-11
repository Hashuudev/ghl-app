"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChatContext } from "../context/ChatContext";
import { useToast } from "@/hooks/use-toast";
import { useCreateAIEmployee } from "../../hooks/useCreateAiEmployee";
import { useRouter } from "next/navigation";
import LoadingOrSuccessAnimationModal from "../../components/LoadingAnimation";

export const SettingsPanel = ({
  isShowActions = true,
  isShowModels = true,
}) => {
  const {
    Models,
    activeModel,
    setActiveModel,
    sendMessageToModel,
    setTestMessageIndex,
    messages,
    generatedPrompt,
    refinementMessageIndices,
    setRefinementMessageIndices,
    setPromptMessageIndices,
    resetContext,
  } = useChatContext();
  const { toast } = useToast();

  const router = useRouter();
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSuccessDeploying, setIsSuccessDeploying] = useState(false);

  const { mutate, isLoading, isSuccess, isError, error } =
    useCreateAIEmployee();

  const handleModelChange = (model) => {
    setActiveModel(model);
  };

  const handleTestClick = () => {
    if (generatedPrompt === "") {
      toast({
        title: "Prompt is not generated yet",
        description:
          "Prompt is not generated yet. Please generate or refine your prompt before testing.",
      });
    } else {
      router.push("/chat/test");
      const testMessage = {
        role: "user",
        content: [
          {
            type: "text",
            text: "Let's test the generated prompt. You act as the chatbot, I will act as a customer. You send the first message and don't reveal that you are AI until someone wants to refine the prompt.",
          },
        ],
      };
      setTestMessageIndex(messages[activeModel].length);
      sendMessageToModel(testMessage);
    }
  };

  // const handleDeploy = () => {
  //   if (generatedPrompt != "") {
  //     // setIsDeploying(true);
  //     if (refinementMessageIndices.length !== 0) {
  //       const updatedPrompt = {
  //         role: "user",
  //         content: [
  //           {
  //             type: "text",
  //             text: "Based On the refinements give me updated prompt",
  //           },
  //         ],
  //       };
  //       sendMessageToModel(updatedPrompt);
  //     }
  //     // wait previous step to complete before coming to this
  //     const { activeLocation } = JSON.parse(localStorage.getItem("userData"));
  //     const locationId = activeLocation;
  //     mutate(
  //       {
  //         locationId,
  //         generatedPrompt,
  //       },
  //       {
  //         onSuccess: () => {
  //           resetContext();
  //           setIsSuccessDeploying(true);
  //           setIsDeploying(false);
  //         },
  //         onError: (error) => {
  //           console.error("Error:", error);
  //           toast({
  //             title: "Error Deploying",
  //             description: "Something Went wrong please try later!",
  //           });
  //           setIsDeploying(false);
  //           // setSubmitError("Failed to submit the prompt. Please try again.");
  //         },
  //       }
  //     );
  //   }
  // };

  const handleDeploy = async () => {
    if (generatedPrompt !== "") {
      setIsDeploying(true);
      try {
        console.log("click deploy");
        if (refinementMessageIndices.length !== 0) {
          const updatedPrompt = {
            role: "user",
            content: [
              {
                type: "text",
                text: "Based on the refinements, give me an updated prompt",
              },
            ],
          };
          console.log("sending message");
          setPromptMessageIndices((prevIndices) => [
            ...prevIndices,
            messages[activeModel].length,
          ]);

          // Wait for the message to be sent and processed
          const updatedResponse = await sendMessageToModel(updatedPrompt);
        }
        console.log("Deploying Now......");
        // Proceed with deployment
        const { activeLocation } = JSON.parse(localStorage.getItem("userData"));
        const locationId = activeLocation;

        mutate(
          {
            locationId,
            generatedPrompt,
          },
          {
            onSuccess: () => {
              resetContext();
              setIsSuccessDeploying(true);
              setIsDeploying(false);
            },
            onError: (error) => {
              console.error("Error:", error);
              toast({
                title: "Error Deploying",
                description: "Something went wrong. Please try again later!",
              });
              setIsDeploying(false);
            },
          }
        );
      } catch (error) {
        console.error("Error in handleDeploy:", error);
        SetMessa;
        toast({
          title: "Error",
          description: "An error occurred during deployment. Please try again.",
        });
        setIsDeploying(false);
      }
    }
  };

  const handleSuccessModalClose = () => {
    setIsDeploying(false);
    setIsSuccessDeploying(false);
    router.replace("/");
  };

  return (
    <Card className="w-64 rounded-none border-l">
      <LoadingOrSuccessAnimationModal
        show={isDeploying || isSuccessDeploying}
        loading={isDeploying}
        success={isSuccessDeploying}
        onClose={handleSuccessModalClose}
      />
      <CardHeader>
        <h2 className="text-xl font-bold">Settings</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {isShowModels && (
          <div>
            <h3 className="text-sm font-semibold mb-2">AI Model</h3>
            <div className="flex items-center justify-between bg-muted rounded-lg p-2">
              <Button
                variant={activeModel === Models.CHATGPT ? "outline" : "solid"}
                onClick={() => handleModelChange(Models.CHATGPT)}
              >
                Chat GPT
              </Button>
              <Button
                variant={activeModel === Models.CLAUDE ? "outline" : "solid"}
                onClick={() => handleModelChange(Models.CLAUDE)}
              >
                Claude
              </Button>
            </div>
          </div>
        )}
        {isShowActions && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Actions</h3>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleTestClick}>
                Test
              </Button>
              <Button onClick={handleDeploy}>Deploy</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
