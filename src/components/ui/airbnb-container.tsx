
import React from 'react';
import { cn } from "@/lib/utils";

interface AirbnbContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function AirbnbContainer({ children, className }: AirbnbContainerProps) {
  return (
    <div className={cn(
      "min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50/30",
      className
    )}>
      <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 space-y-4 md:space-y-8 max-w-none">
        {children}
      </div>
    </div>
  );
}
