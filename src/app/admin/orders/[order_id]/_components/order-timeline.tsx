"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Package } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { OrderTimeline, OrderTimelineEventType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderTimelineProps {
  timeline: OrderTimeline[];
  canAddEvents?: boolean;
  onAddEvent?: (data: {
    eventType: OrderTimelineEventType;
    message: string;
  }) => Promise<void>;
}

export default function OrderTimelineSection({
  timeline,
  canAddEvents = false,
  onAddEvent,
}: OrderTimelineProps) {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedEventType, setSelectedEventType] = useState<
    OrderTimelineEventType | ""
  >("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedEventType || !message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddEvent?.({
        eventType: selectedEventType as OrderTimelineEventType,
        message,
      });
      setMessage("");
      setSelectedEventType("");
      setIsAddingEvent(false);
      toast({
        title: "Success",
        description: "Timeline event added successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add timeline event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEventTypeLabel = (eventType: OrderTimelineEventType) => {
    return eventType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Package className="h-7 w-7" />
          Order Timeline
        </CardTitle>
        <CardDescription>Track the order's journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          {/* Continuous vertical line */}
          <div
            className="absolute left-[5.5px] top-1 bottom-1 w-px bg-gray-200"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {timeline.map((event) => (
              <div key={event.id} className="relative">
                {/* Dot with outline */}
                <div
                  className="absolute -left-6 mt-1.5 w-3 h-3 rounded-full border-2 border-white bg-primary ring-[3px] ring-primary/20"
                  aria-hidden="true"
                />

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">
                      {getEventTypeLabel(event.eventType)}
                    </h4>
                    <div
                      className="h-px flex-1 bg-gray-100"
                      aria-hidden="true"
                    />
                    <time className="flex-shrink-0 text-sm text-gray-500">
                      {format(new Date(event.createdAt), "MMM d, yyyy")}
                    </time>
                  </div>
                  <div className="mt-1.5">
                    <time className="text-sm text-gray-500">
                      {format(new Date(event.createdAt), "h:mm a")}
                    </time>
                    <p className="mt-1 text-sm text-gray-600 leading-normal">
                      {event.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {canAddEvents && isAddingEvent && (
              <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
                <Select
                  value={selectedEventType}
                  onValueChange={(value) =>
                    setSelectedEventType(value as OrderTimelineEventType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(OrderTimelineEventType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getEventTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message..."
                  className="w-full"
                />

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingEvent(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Event"}
                  </Button>
                </div>
              </div>
            )}

            {canAddEvents && !isAddingEvent && (
              <Button
                variant="outline"
                onClick={() => setIsAddingEvent(true)}
                className="w-full"
              >
                Add Timeline Event
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
