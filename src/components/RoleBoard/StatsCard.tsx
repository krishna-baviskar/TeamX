"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatsCard({ label, value, suffix = "", icon, className, trend }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const start = 0;
    const end = value;
    const increment = end / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <Card className={cn("glass-card accent-line-top p-6 flex flex-col justify-between overflow-hidden", className)}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{label}</span>
        {icon && <div className="text-primary opacity-80">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-headline font-extrabold font-code tracking-tighter">
          {displayValue}{suffix}
        </span>
        {trend && (
          <span className={cn(
            "text-xs font-bold px-1.5 py-0.5 rounded ml-2",
            trend === "up" ? "bg-green-500/20 text-green-500" : 
            trend === "down" ? "bg-red-500/20 text-red-500" : "bg-muted text-muted-foreground"
          )}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
    </Card>
  );
}
