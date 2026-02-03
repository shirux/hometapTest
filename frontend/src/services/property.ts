import { IProvidersResponse } from "../interfaces";

const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

export const fetchPropertyDetails = async (address: string) => {
  console.log("backendApiUrl", backendApiUrl);
  const url = `${backendApiUrl}/properties?address=${encodeURIComponent(
    address,
  )}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return (await response.json()) as IProvidersResponse;
  } catch (error) {
    console.error("Error fetching property details:", error);
    throw error;
  }
};
