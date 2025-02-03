import { Construction, Info } from "lucide-react";

export default function ConstructionAlert() {
  return (
    <div className="bg-amber-50 border-y border-amber-200">
      <div className="container max-w-screen-xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Construction className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 flex-1">
            <span className="font-semibold">Website Under Construction:</span>{" "}
            Features and prices shown are for demonstration purposes only. No
            actual transactions can be processed at this time.
          </p>
          <Info className="h-4 w-4 text-amber-600 hidden sm:block flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
