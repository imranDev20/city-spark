import axios from "axios";
import { Address } from "@prisma/client";

export interface AddressApiResponse {
  success: boolean;
  message: string;
  data?: Address[];
}

export async function fetchUserAddresses(): Promise<AddressApiResponse> {
  try {
    const { data } = await axios.get<AddressApiResponse>(
      "/api/account/addresses"
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch addresses",
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
