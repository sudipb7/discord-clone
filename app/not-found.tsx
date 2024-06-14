import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="h1">404 Not Found</h1>
      <p className="p text-center max-w-[52rem] mx-auto">
        The page you are looking for does not exist. <br /> Perhaps you can return back to the
        site‘s homepage.
      </p>
      <Button>
        <Link href="/">Return Home</Link>
      </Button>
    </main>
  );
}
