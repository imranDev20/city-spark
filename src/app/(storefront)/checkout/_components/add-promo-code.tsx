import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Plus } from 'lucide-react'
export default function AddPromoCode() {
  return (
    <Dialog>
    <DialogTrigger className='flex justify-center gap-2 py-2 px-4 bg-[#E8E8E8] rounded-[8px] ' ><Plus /> Add Promo Code</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your account
          and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
  )
}
