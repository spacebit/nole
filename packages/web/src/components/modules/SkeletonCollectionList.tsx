import React from "react";

const SkeletonCollectionList: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-center gap-2 animate-pulse">
          <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
          <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCollectionList;
