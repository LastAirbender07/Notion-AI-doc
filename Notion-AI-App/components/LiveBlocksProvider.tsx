"use client";
import React, { ReactNode } from "react";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";

const LiveBlocksProvider = ({ children }: { children: ReactNode }) => {
  if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
    throw new Error("NEXT_PUBLIC_LIVEBLOCKS_KEY is not set");
  }
  return (
    <LiveblocksProvider throttle={16} authEndpoint={`/auth-endpoint`}>
      {children}
    </LiveblocksProvider>
  );
};

export default LiveBlocksProvider;
