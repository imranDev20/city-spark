"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

const messages = [
  "boilers",
  "heaters",
  "bathroom & kitchen tiles",
  "plumbing tools and items",
  "spares",
  "renewables",
  "electrical & lighting items",
  "clearance",
  // Add more messages as needed
];

export default function SearchInput() {
  const [placeholder, setPlaceholder] = useState("Search for ");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const currentMessage = messages[messageIndex];
    let typingSpeed = 100;

    if (isDeleting) {
      typingSpeed /= 2;
    }

    const handleTyping = () => {
      if (!isDeleting && index < currentMessage.length) {
        setPlaceholder("Search for " + currentMessage.substring(0, index + 1));
        setIndex(index + 1);
      } else if (isDeleting && index > 0) {
        setPlaceholder("Search for " + currentMessage.substring(0, index - 1));
        setIndex(index - 1);
      } else if (!isDeleting && index === currentMessage.length) {
        setTimeout(() => setIsDeleting(true), 1000); // Pause before deleting
      } else if (isDeleting && index === 0) {
        setIsDeleting(false);
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }
    };

    const timeoutId = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timeoutId);
  }, [index, isDeleting, messageIndex]);

  return (
    <>
      <div className="has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring  ring-primary flex-1 h-11 ml-10 flex items-center overflow-hidden rounded-lg bg-gray-500/10 shadow-sm">
        <Input
          className="w-full border-0 h-full py-5 rounded-none focus-visible:ring-0 typing-placeholder"
          placeholder={placeholder}
        />

        <Button className="rounded-none h-full">
          <SearchIcon />
        </Button>
      </div>
    </>
  );
}
