import { GoogleUser } from "@/app/api/login/google/callback/route";
import { db } from "@/db/db-connection";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  const user = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user[0];
}

export async function insertUser(
  socialName: "google" | "github",
  socialId: string,
  name: string,
  email: string,
  avatarUrl: string,
) {
  let socialIdColumn;
  switch (socialName) {
    case "google":
      socialIdColumn = "googleId";
      break;
    case "github":
      socialIdColumn = "githubId";
      break;
    default:
      throw Error("Social name does not match");
  }

  const [user] = await db
    .insert(users)
    .values({
      name: name,
      email: email,
      avatarUrl: avatarUrl,
      [socialIdColumn]: socialId,
    })
    .returning({ id: users.id });
  return user;
}

export async function getUserByGitHubId(githubId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.githubId, githubId))
    .limit(1);
  return user;
}
