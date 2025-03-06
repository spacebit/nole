"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useLoader } from "@/contexts/LoaderContext";

const Loader: React.FC = () => {
  const { loaderState, hideLoader } = useLoader();
  const { message, status } = loaderState || {};

  useEffect(() => {
    if (status !== "loading" && message) {
      const timer = setTimeout(() => hideLoader(), 5000);
      return () => clearTimeout(timer);
    }
  }, [message, status, hideLoader]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 border w-72"
        >
          {status === "loading" && (
            <Loader2 className="animate-spin text-gray-500" size={24} />
          )}
          {status === "success" && (
            <CheckCircle className="text-green-500" size={24} />
          )}
          {status === "error" && <XCircle className="text-red-500" size={24} />}

          <span
            className={`text-sm font-medium ${
              status === "success"
                ? "text-green-600"
                : status === "error"
                ? "text-red-600"
                : "text-gray-800"
            }`}
          >
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
