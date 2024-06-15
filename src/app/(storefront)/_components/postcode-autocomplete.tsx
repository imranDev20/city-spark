"use client";
import Autocomplete, { type Option } from "@/components/custom/autocomplete";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAllPostcodes } from "@/services/woosmap.services";
import { Input } from "@/components/ui/input";

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

  const handleValueChange = (e) => {
    console.log(e);
  };

  return (
    <div className="not-prose mt-4 flex flex-col gap-4">
      <Autocomplete
        options={FRAMEWORKS}
        emptyMessage="No resulsts."
        placeholder="Find something"
        isLoading={isLoading}
        onValueChange={handleValueChange}
        value={value}
        disabled={isDisabled}
      />
    </div>
  );
}
