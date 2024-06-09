import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getUserAccountById(userId: string) {
  try {
    return await db.account.findFirst({ where: { userId } });
  } catch (error) {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    return await db.user.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await db.user.findUnique({ where: { email } });
  } catch (error) {
    return null;
  }
}

export async function currentUser() {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    return getUserById(session.user.id);
  } catch (error) {
    return null;
  }
}
