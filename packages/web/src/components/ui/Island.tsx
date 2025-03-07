"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface IslandProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Island: React.FC<IslandProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn("bg-zinc-100 shadow-sm rounded-lg p-6", className)} {...props}>
      {children}
    </div>
  );
};

export default Island;
