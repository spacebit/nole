import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = "", id, name, ...props }) => {
  const inputId = id || name;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          id={inputId}
          name={name}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out ${
            error ? "border-red-500" : "border-gray-300"
          } ${className}`}
        />
      </div>
      {error && <p id={errorId} className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
