import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { getUserById, getUserAccountById } from "@/lib/queries";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      const existingAccount = await getUserAccountById(user?.id);

      token.isOauth = !!existingAccount;
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
      session.user.isOAuth = token.isOAuth as boolean;

      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(db),
  debug: process.env.NODE_ENV === "development",
  ...authConfig,
});
