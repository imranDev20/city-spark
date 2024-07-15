import { useSearchParams } from "next/navigation";

export default function useQueryString() {
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (value === "") {
      newSearchParams.delete(name);
    } else {
      newSearchParams.set(name, value);
    }

    const newQueryString = newSearchParams.toString();
    return newQueryString;
  };
  const removeQueryString = (name: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    newSearchParams.delete(name);

    return newSearchParams.toString();
  };

  return { createQueryString, removeQueryString };
}
