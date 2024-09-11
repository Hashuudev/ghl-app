"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchIndustries = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/industries`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
    }
  ); // Adjust the endpoint as needed
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useIndustries = () => {
  return useQuery({ queryKey: "industries", queryFn: fetchIndustries });
};
