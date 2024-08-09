import { lucia } from "./lucia";
import { cookies } from "next/headers";

export async function createSessionAndCookie(existingUserId: number) {
  const session = await lucia.createSession(existingUserId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}
