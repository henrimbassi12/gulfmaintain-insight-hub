
import React from 'react';
import { cn } from "@/lib/utils";

interface AirbnbContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function AirbnbContainer({ children, className }: AirbnbContainerProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {children}
      </div>
    </div>
  );
}
