import axios from "axios";

// API Response Types
interface MatchedSubstring {
  offset: number;
  length: number;
}

interface WoosmapLocality {
  public_id: string;
  type: string;
  types: string[];
  description: string;
  matched_substrings: {
    description: MatchedSubstring[];
  };
  has_addresses: boolean;
}

export interface WoosmapResponse {
  localities: WoosmapLocality[];
}

export async function fetchPostcodes(input: string): Promise<WoosmapResponse> {
  if (!input) return { localities: [] };

  try {
    const config = {
      method: "get",
      url: `https://api.woosmap.com/localities/autocomplete/?input=${encodeURIComponent(
        input
      )}&components=country%3Agb&no_deprecated_fields=true&key=woos-e77092fe-0b39-3f5a-85ce-33aaabbba621`,
      headers: {
        Referer: "http://localhost",
      },
    };

    const { data } = await axios<WoosmapResponse>(config);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch postcodes"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Geometry {
  location: {
    lat: number;
    lng: number;
  };
}

export interface WoosmapDetailsResponse {
  result: {
    public_id: string;
    types: string[];
    formatted_address: string;
    geometry: Geometry;
    name: string; // Adding this as it's present in the response
    address_components: AddressComponent[];
  };
}
export async function fetchPostcodeDetails(
  publicId: string
): Promise<WoosmapDetailsResponse> {
  if (!publicId) {
    throw new Error("Public ID is required");
  }

  try {
    const config = {
      method: "get",
      url: `https://api.woosmap.com/localities/details?public_id=${encodeURIComponent(
        publicId
      )}&key=woos-e77092fe-0b39-3f5a-85ce-33aaabbba621`,
      headers: {
        Referer: "http://localhost",
      },
    };

    const { data } = await axios<WoosmapDetailsResponse>(config);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch postcode details"
      );
    }
    throw new Error("An unexpected error occurred");
  }
}
