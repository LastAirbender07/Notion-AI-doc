"use client";

import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/actions/actions";

const NewDocButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateNewDocument = () => {
    startTransition(async () => {
      const { docId } = await createNewDocument();
      router.push(`/doc/${docId}`);
    });
  };

  return <Button onClick={handleCreateNewDocument} disabled={isPending}>
    {isPending ? "Creating..." : "New Document"}
  </Button>;
};

export default NewDocButton;
