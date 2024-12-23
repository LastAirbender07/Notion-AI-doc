import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="flex items-center space-x-2 animate-pulse py-2">
      <ArrowLeftCircle className="w-12 h-12" />
      <h1 className="font-bold">Get Started with creating a New Document</h1>
    </main>
  );
}

// backend: https://notion-ai-workers.jayarajviswanathan.workers.dev
