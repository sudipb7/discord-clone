import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/queries";

export default async function Home() {
  const user = await currentUser();

  return (
    <main className="h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="h1">Welcome to Discord</h1>
      {user ? (
        <p className="p text-center">
          You are signed in as {user.name} {`<${user.email}>`}
        </p>
      ) : (
        <p className="p text-center max-w-[52rem] mx-auto">
          Discord is the easiest way to communicate over voice, video, and text. Chat, hang out, and
          stay close with your friends and communities.
        </p>
      )}
      <Button>
        <Link href={user ? "/channels/@me" : "/sign-in"}>Get Started</Link>
      </Button>
    </main>
  );
}
