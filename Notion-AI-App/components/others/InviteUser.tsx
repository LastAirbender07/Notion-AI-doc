"use client";

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
import { usePathname } from "next/navigation";
import { inviteUserToDocument } from "@/actions/actions";
import { toast } from "sonner";
import { Input } from "../ui/input";

function InviteUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const pathName = usePathname();

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    const roomId = pathName.split("/").pop();
    if (!roomId) return;

    startTransition(async () => {
        const {success} = await inviteUserToDocument(roomId, email);
        if(success){
            setIsOpen(false);
            setEmail("");
            toast.success("User Added to Room successfully");
        }
        else{
            toast.error("Failed to Add User!");
        }
    })
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={"outline"}>
        <DialogTrigger>Invite</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a User to collaborate!</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to invite
          </DialogDescription>
        </DialogHeader>
        <form>
          <Input
            type="email"
            placeholder="clark@gmail.com"
            value={email}
            className="w-full"
            onChange={(e) => setEmail(e.target.value)}
          />
        </form>
        <DialogFooter className="sm:justify-end gap-2">
          <Button
            type="submit"
            onClick={handleInvite}
            disabled={isPending || !email}
          >
            {isPending ? "Invitinging..." : "Invite"}
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
}

export default InviteUser;
