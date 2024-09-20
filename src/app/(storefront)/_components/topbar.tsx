import { HelpCircle, MapPin, Phone, Truck } from "lucide-react";
import React from "react";

export default function TopBar() {
  return (
    <div className="bg-black text-white py-2 px-4">
      <div className="container mx-auto flex justify-between items-center max-w-screen-xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Phone size={18} className="mr-1" />
            <span>Sales & Support</span>
          </div>
          <div className="flex items-center">
            <HelpCircle size={18} className="mr-1" />
            <span>FAQs</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Truck size={18} className="mr-1" />
            <span>Track Your Order</span>
          </div>
          <div className="flex items-center">
            <MapPin size={18} className="mr-1" />
            <span>Store Location</span>
          </div>
        </div>
      </div>
    </div>
  );
}
