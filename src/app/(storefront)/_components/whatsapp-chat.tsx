"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WhatsAppChat() {
  // Hardcoded configuration values
  const phoneNumber = "447123456789"; // Replace with your actual WhatsApp number
  const welcomeMessage =
    "Hello! I'm interested in your products. Can you help me?";
  const position = "right";
  const color = "#25D366"; // WhatsApp green

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Only show the widget after the component has mounted to prevent hydration errors
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle click on the chat button
  const handleChatClick = () => {
    setIsOpen(!isOpen);
  };

  // Handle click on the "Start Chat" button
  const handleStartChat = () => {
    // Encode the welcome message for the URL
    const encodedMessage = encodeURIComponent(welcomeMessage);
    // Open WhatsApp in a new tab
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 z-50 flex flex-col items-end",
        position === "right" ? "right-6" : "left-6"
      )}
    >
      {/* Chat popup */}
      {isOpen && (
        <div className="mb-4 w-72 sm:w-80 bg-white rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div
            className="p-4 flex items-center justify-between"
            style={{ backgroundColor: color }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h3 className="text-white font-medium">WhatsApp Chat</h3>
                <p className="text-white/80 text-xs">
                  Typically replies within an hour
                </p>
              </div>
            </div>
            <button
              onClick={handleChatClick}
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            <p className="text-gray-600 mb-6">
              Hi there! 👋
              <br />
              How can we help you?
            </p>

            <button
              onClick={handleStartChat}
              className="w-full py-2 px-4 rounded font-medium text-white transition-all"
              style={{ backgroundColor: color }}
            >
              Start Chat
            </button>
          </div>
        </div>
      )}

      {/* Chat button */}
      <button
        onClick={handleChatClick}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        style={{ backgroundColor: color }}
        aria-label="WhatsApp Chat"
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
      </button>
    </div>
  );
}
