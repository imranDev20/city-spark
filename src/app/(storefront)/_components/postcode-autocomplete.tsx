"use client";
import Autocomplete, { type Option } from "@/components/custom/autocomplete";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

const FRAMEWORKS = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "wordpress",
    label: "WordPress",
  },
  {
    value: "express.js",
    label: "Express.js",
  },
  {
    value: "nest.js",
    label: "Nest.js",
  },
];

export default function PostcodeAutocomplete() {
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setDisbled] = useState(false);
  const [value, setValue] = useState<Option>();

  const handleChange = (e: string) => {
    console.log(e);
  };

  return (
    <div className="grid grid-cols-4 gap-3 mt-5 mb-3">
      <div className="col-span-3">
        <Autocomplete
          options={[]}
          onChange={handleChange}
          emptyMessage="No resulsts."
          placeholder="Find something"
          isLoading={isLoading}
          // onValueChange={handleValueChange}
          value={value}
          disabled={isDisabled}
        />
      </div>
      <div className="col-span-1">
        <Button className="h-[46px] w-full" variant="outline">
          <Navigation className="mr-1" />
          Use My Location
        </Button>
      </div>
    </div>
  );
}
