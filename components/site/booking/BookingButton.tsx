"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { services } from "@/lib/data/services";
import { cn } from "@/lib/utils";
import BookingFlow from "./BookingFlow";

interface BookingButtonProps {
  serviceSlug: string;
  className?: string;
}

export default function BookingButton({ serviceSlug, className }: BookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const service = services.find((s) => s.slug === serviceSlug);

  if (!service) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 bg-terracotta text-white font-body text-sm font-medium px-6 py-3 hover:bg-terracotta-dark transition-colors duration-300",
          className
        )}
      >
        <Calendar size={18} />
        Randevu Al
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 w-full h-full">
            <BookingFlow service={service} onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
