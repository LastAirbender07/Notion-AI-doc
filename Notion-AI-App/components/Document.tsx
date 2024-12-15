"use client";
import React, { FormEvent, use, useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./others/Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./others/DeleteDocument";
import InviteUser from "./others/InviteUser";
import ManageUsers from "./others/ManageUsers";
import Avatars from "./others/Avatars";

const Document = ({ id }: { id: string }) => {
  const [input, setInput] = useState("");
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner();

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), { title: input });
      });
    }
  };

  return (
    <div className="flex-1 h-full bg-white p-5 rounded-md">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form onSubmit={updateTitle} className="flex flex-1 space-x-2">
          <Input
            value={input}
            type="text"
            className="font-bold text-2xl"
            onChange={(e) => setInput(e.target.value)}
          />

          <Button type="submit">{isUpdating ? "Updating..." : "Update"}</Button>

          {isOwner && (
            <>
            <InviteUser/>
            <DeleteDocument/>
            </>
          )}
        </form>
      </div>

      <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
        <ManageUsers/>
        {/* <Avatars/> */}
      </div>
      <hr className="pb-10" />
      <Editor/>
    </div>
  );
};

export default Document;
