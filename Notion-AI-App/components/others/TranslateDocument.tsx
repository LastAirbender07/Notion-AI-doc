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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "../ui/button";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import { BotIcon } from "lucide-react";
import Markdown from "react-markdown";

type Language =
  | "english"
  | "french"
  | "german"
  | "chinese"
  | "tamil"
  | "japanese"
  | "arabic"
  | "hindi";

const languages: Language[] = [
  "english",
  "french",
  "german",
  "chinese",
  "tamil",
  "japanese",
  "arabic",
  "hindi",
];

const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState<string>("");

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translate-document`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ documentData, targetLang: language }),
        }
      );
      if (res.ok) {
        const { translated_text } = await res.json();
        setSummary(translated_text);
        toast.success("Translated Summary successfully");
      } else {
        toast.error("Failed to translate!");
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={"outline"}>
        <DialogTrigger>Translate</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate the Document</DialogTitle>
          <DialogDescription>
            Select the language and AI will translate a summary of the document
            in the selected language
          </DialogDescription>
          <hr className="mt-5" />
          {question && <p className="text-gray-500 mt-5">Q: {question}</p>}
        </DialogHeader>
        <form className="flex gap-2" onSubmit={handleAskQuestion}>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </form>
        <div>
          {summary && (
            <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
              <div className="flex">
                <BotIcon className="w-10 flex-shrink-0" />
                <p className="font-bold">
                  GPT {isPending ? "is thinking..." : "Says:"}
                </p>
              </div>
              <p>
                {isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}"
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-end gap-2">
          <Button
            type="submit"
            onClick={handleAskQuestion}
            disabled={isPending || !language}
          >
            {isPending ? "Translating..." : "Translate"}
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

export default TranslateDocument;
