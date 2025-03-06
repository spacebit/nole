"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import Island from "@/components/ui/Island";
import Text from "@/components/ui/Text";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center p-10">
      <Island className="flex flex-col items-center text-center max-w-md p-8">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <Text variant="h1" className="mb-2">
          Page Not Found
        </Text>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </Island>
    </div>
  );
}
