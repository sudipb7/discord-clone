import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-primary text-2xl md:text-3xl font-mono font-bold tracking-wide leading-normal">
        Welcome to Discord
      </h1>
      <p className="text-zinc-600 max-w-[52rem] mx-auto text-center font-medium leading-snug">
        Discord is the easiest way to communicate over voice, video, and text. Chat, hang out, and
        stay close with your friends and communities.
      </p>
      <Button>
        <Link href="/auth/sign-in">Get Started</Link>
      </Button>
    </main>
  );
}
