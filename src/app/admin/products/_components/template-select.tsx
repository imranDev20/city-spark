"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function TemplateSelect() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    const filteredSuggestions = [
      "Apple",
      "Banana",
      "Cherry",
      "Durian",
      "Elderberry",
    ].filter((fruit) => fruit.toLowerCase().includes(inputValue.toLowerCase()));
    setSuggestions(filteredSuggestions);
    setSelectedIndex(-1);
  };
  const handleKeyDown = (e: any) => {
    if (e.key === "ArrowUp" && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (
      e.key === "ArrowDown" &&
      selectedIndex < suggestions.length - 1
    ) {
      setSelectedIndex(selectedIndex + 1);
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      setValue(suggestions[selectedIndex]);
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };
  const handleSuggestionClick = (suggestion: any) => {
    setValue(suggestion);
    setSuggestions([]);
    setSelectedIndex(-1);
  };
  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for a template..."
      />
      {suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          <ul className="max-h-48 overflow-y-auto px-2 py-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                className={`text-sm rounded-md cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                  index === selectedIndex ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
