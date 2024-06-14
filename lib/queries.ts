import { db } from "./db";
import { auth } from "./auth";

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
