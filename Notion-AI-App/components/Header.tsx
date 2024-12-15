"use client";
import React from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Breadcrums from "./Breadcrums";

const Header = () => {
  const { user } = useUser();
  return (
    <div className="flex justify-between items-center p-5 pb-0">
      {user && (
        <h1 className="text-2xl font-semibold">
          {user?.firstName}
          {`'s`} Space
        </h1>
      )}
      <Breadcrums/>

      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <UserButton/>
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
