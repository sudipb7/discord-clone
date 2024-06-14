import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";

export default async function SignInPage() {
  const signInWithGoogle = async () => {
    "use server";
    await signIn("google");
  };

  const signInWithGithub = async () => {
    "use server";
    await signIn("github");
  };

  return (
    <main className="min-h-screen p-4 flex items-center justify-center">
      <section className="w-full max-w-xs p-4">
        <div className="space-y-1">
          <h1 className="h1">Almost There!</h1>
          <p className="p">Sign in to continue to Discord.</p>
        </div>
        <form className="space-y-3 mt-4">
          <Button
            formAction={signInWithGoogle}
            variant="outline"
            className="gap-4 w-full"
          >
            <Icons.google size={20} />
            Continue with Google
          </Button>
          <Button
            formAction={signInWithGithub}
            variant="outline"
            className="gap-4 w-full"
          >
            <Icons.github
              size={20}
              className="dark:invert"
            />
            Continue with Github
          </Button>
        </form>
      </section>
    </main>
  );
}
