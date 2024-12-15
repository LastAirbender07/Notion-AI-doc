"use client";
import React from "react";
import * as Y from "yjs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import { BotIcon, UserIcon } from "lucide-react";
import Markdown from "react-markdown";
import { Input } from "../ui/input";

const AskQuestion = ({ doc }: { doc: Y.Doc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();
      try{
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/chat-to-document`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ documentData, question }),
            }
          );
          if (res.ok) {
            const response = await res.json();
            setReply(response);
          } else {
            toast.error("The bot is down now, Please try again later!");
          }
      }
      catch(e){
        toast.error("An Error Occured!");
        console.log(e);
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild>
        <DialogTrigger>Chat with Doc</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat with the Document</DialogTitle>
          <DialogDescription>
            Ask a question and get a reply from the document.
          </DialogDescription>
          <hr className="mt-5" />
        </DialogHeader>
        <form className="flex gap-2" onSubmit={handleAskQuestion}>
          <Input
            type="text"
            placeholder="chat with me"
            value={question}
            className="w-full"
            onChange={(e) => setQuestion(e.target.value)}
          />
        </form>
        <div>
          {reply && (
            <div>
              <div className="flex items-start max-h-96 gap-2 px-2 py-3 rounded-lg bg-gray-100">
                <div className="flex">
                  <UserIcon className="w-10 flex-shrink-0" />
                  <div className="font-bold">
                    Question: 
                  </div>
                </div>
                <div>
                  <Markdown>{question}</Markdown>
                </div>
              </div>
              <hr className="mt-2"/>
              <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
                <div className="flex">
                  <BotIcon className="w-10 flex-shrink-0" />
                  <div className="font-bold">
                    GPT {isPending ? "is thinking..." : "Says:"}
                  </div>
                </div>
                <div>
                  {isPending ? "Thinking..." : <Markdown>{reply}</Markdown>}
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-end gap-2">
          <Button
            type="submit"
            onClick={handleAskQuestion}
            disabled={isPending || !question}
          >
            {isPending ? "Processing..." : "Post Question"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AskQuestion;
