"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface LoaderProps {
  message: string;
  status?: "loading" | "success" | "error";
}

const Loader: React.FC<LoaderProps> = ({ message, status = "loading" }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true); // Always show when a new message comes in

    if (status !== "loading") {
      const timer = setTimeout(() => setVisible(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [message, status]); // Depend on message/status to reset visibility

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 border w-72"
        >
          {status === "loading" && <Loader2 className="animate-spin text-gray-500" size={24} />}
          {status === "success" && <CheckCircle className="text-green-500" size={24} />}
          {status === "error" && <XCircle className="text-red-500" size={24} />}

          <span className={`text-sm font-medium ${status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : "text-gray-800"}`}>
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
