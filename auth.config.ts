import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

import { SignInFormSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/queries";

export default {
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Github({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      async authorize(credentials) {
        const validated = SignInFormSchema.safeParse(credentials);
        if (validated.success) {
          const { email, password } = validated.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const isValidPassword = await bcrypt.compare(password, user.password);
          if (isValidPassword) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
