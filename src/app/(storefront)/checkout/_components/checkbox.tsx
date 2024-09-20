"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function CheckboxWithText() {
  return (
    <div className="items-top flex space-x-3 items-center">
      <Checkbox className="w-6 h-6"  id="terms1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-lg font-medium text-muted-foreground"
        >
        Do you want to receive offers from us via email?
        </label>
      
      </div>
    </div>
  )
}
