
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { getCategory } from "../new/actions";

const frameworks = [
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
  ]

export default async function CategoryDropdown(props:any) {
    const category = await getCategory(props.categoryValue);
    console.log(`category`, category);
  return (
    <Popover >
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        // aria-expanded={open}
        className="w-[200px] justify-between"
      >
        {/* {value
          ? frameworks.find((framework) => framework.value === value)
              ?.label
          : "Select framework..."} */}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[200px] p-0">
      <Command>
        <CommandInput placeholder="Search framework..." />
        <CommandEmpty>No framework found.</CommandEmpty>
        <CommandGroup>
          {frameworks.map((framework) => (
            <CommandItem
              key={framework.value}
              value={framework.value}
              onSelect={(currentValue) => {
                // setValue(currentValue === value ? "" : currentValue);
                // setOpen(false);
              }}
            >
              <Check
                // className={cn(
                //   "mr-2 h-4 w-4",
                //   value === framework.value
                //     ? "opacity-100"
                //     : "opacity-0"
                // )}
              />
              {framework.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </PopoverContent>
  </Popover>
  )
}
