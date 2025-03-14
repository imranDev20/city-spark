import axios from "axios";
import { User } from "@prisma/client";

export interface AuthInfo {
  hasPassword: boolean;
  providers: string[];
}

// Type for the API response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Define a type with only the fields we need from User
export type UserProfile = Pick<
  User,
  "id" | "firstName" | "lastName" | "email" | "phone" | "avatar"
> & {
  authInfo?: AuthInfo;
};

// Function to fetch the user profile
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const { data } = await axios.get<ApiResponse<UserProfile>>(
      "/api/account/profile"
    );

    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to fetch profile");
    }

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch profile");
    }
    throw error;
  }
}
