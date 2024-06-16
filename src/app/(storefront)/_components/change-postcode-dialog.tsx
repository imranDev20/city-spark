import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import PostcodeAutocomplete from "./postcode-autocomplete";

export default function ChangePostcodeDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="py-6 items-center ml-10 hover:bg-primary/10"
        >
          <MapPin className="text-primary" />
          <div className="flex flex-col items-start ml-2">
            <p className="text-xs text-neutral-500 font-light">Deliver to</p>
            <p className="text-sm">E3 4SY</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <MapPin className="mr-1 text-primary" /> Select a Delivery Postcode
          </DialogTitle>
          <DialogDescription className="mt-4">
            Enter your delivery postcode below to see the products available for
            delivery to your location.
          </DialogDescription>
        </DialogHeader>

        <PostcodeAutocomplete />

        <DialogFooter>
          <Button variant="outline" type="submit">
            Cancel
          </Button>
          <Button type="submit">Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
