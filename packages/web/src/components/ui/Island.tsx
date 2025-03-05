"use client";

import React from "react";
import clsx from "clsx";

interface IslandProps {
  children: React.ReactNode;
  className?: string;
}

const Island: React.FC<IslandProps> = ({ children, className }) => {
  return (
    <div className={clsx("bg-zinc-100 shadow-sm rounded-lg p-6", className)}>
      {children}
    </div>
  );
};

export default Island;
