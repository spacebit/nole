"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2, X } from "lucide-react";
import { useLoader } from "@/contexts/LoaderContext";
import Text from "@/components/ui/Text";
import { cn } from "@/lib/utils";

const LoaderIcon: React.FC<{ status?: "loading" | "success" | "error" }> = ({ status }) => {
  if (status === "loading") return <Loader2 className="animate-spin text-gray-500" size={24} />;
  if (status === "success") return <CheckCircle className="text-green-500" size={24} />;
  if (status === "error") return <XCircle className="text-red-500" size={24} />;
  return null;
};

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
          role="status"
          aria-live="polite"
        >
          <LoaderIcon status={status} />
          <Text
            variant="span"
            className={cn(
              "text-sm font-medium flex-1",
              status === "success" && "text-green-600",
              status === "error" && "text-red-600",
              status === "loading" && "text-gray-800"
            )}
          >
            {message}
          </Text>
          <button onClick={hideLoader} className="text-gray-400 hover:text-gray-600 transition">
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
