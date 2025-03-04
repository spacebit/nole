import React from "react";

interface PlaceholderProps {
  message: string;
  action?: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 text-center">
      <h2 className="text-2xl font-semibold">{message}</h2>
      {action && <p className="text-md mt-2">{action}</p>}
    </div>
  );
};

export default Placeholder;
