import React from "react";

const SkeletonCard: React.FC = () => {
  return (
    <div className="w-56 h-72 bg-gray-200 animate-pulse rounded-lg shadow-md flex flex-col">
      <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
      <div className="flex flex-col gap-2 p-3">
        <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
