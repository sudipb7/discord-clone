import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import { getUserById } from "@/lib/queries";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Github({ allowDangerousEmailAccountLinking: true }),
  ],
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      token.name = user.name;
      token.email = user.email;

      return token;
    },
    async session({ token, session }) {
      if (!session.user) return session;
      if (token.sub) {
        session.userId = token.sub;
        session.user.id = token.sub;
      }

      if (token.email) {
        session.user.email = token.email;
      }

      session.user.name = token.name;

      return session;
    },
  },
  pages: { signIn: "/sign-in" },
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(db),
  debug: process.env.NODE_ENV === "development",
});
