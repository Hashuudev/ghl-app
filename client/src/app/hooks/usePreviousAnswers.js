"use client";

import { useQuery } from "@tanstack/react-query";

// Function to fetch previous answers based on locationId
const fetchPreviousAnswers = async (locationId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/industries/${locationId}/previousAnswers`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

// Custom hook for fetching previous answers
export const usePreviousAnswers = (locationId) => {
  return useQuery({
    queryKey: ["previousAnswers", locationId], // Unique query key based on locationId
    queryFn: () => fetchPreviousAnswers(locationId), // Pass the locationId to the fetch function
    enabled: !!locationId, // Only run the query if locationId is provided
  });
};
