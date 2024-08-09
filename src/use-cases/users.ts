import { insertUserQuota } from "@/data-access/quotas";
import {
  insertUser,
  getUserByEmail,
  getUserByGitHubId,
} from "@/data-access/users";

export async function getUserByEmailUseCase(email: string) {
  return await getUserByEmail(email);
}

export async function createUserUseCase(
  socialName: "google" | "github",
  socialId: string,
  name: string,
  email: string,
  avatarUrl: string,
) {
  const newUser = await insertUser(
    socialName,
    socialId,
    name,
    email,
    avatarUrl,
  );

  await insertUserQuota(newUser.id);

  return newUser.id;
}

export async function getUserByGitHubIdUseCase(githubId: string) {
  return await getUserByGitHubId(githubId);
}
