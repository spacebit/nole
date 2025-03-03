"use client";

import React from "react";
import CreateCollectionForm from "@/components/modules/CreateCollectionForm";

const CreateCollectionPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 flex justify-center">
      <CreateCollectionForm />
    </div>
  );
};

export default CreateCollectionPage;
