"use client";

import React from "react";

interface IslandProps {
  children: React.ReactNode;
  className?: string;
}

const Island: React.FC<IslandProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Island;
