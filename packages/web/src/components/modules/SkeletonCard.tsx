import React from "react";

interface SkeletonCardProps {
  variant?: "small" | "large";
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ variant = "small" }) => {
  const containerClasses = variant === "large" ? "w-56 h-72" : "w-28 h-36";
  const imageHeight = variant === "large" ? "h-48" : "h-24";

  return (
    <div className={`${containerClasses} bg-gray-200 animate-pulse rounded-lg shadow-md flex flex-col`}>
      <div className={`w-full ${imageHeight} bg-gray-300 rounded-t-lg`}></div>
      <div className="flex flex-col gap-2 p-3">
        <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
