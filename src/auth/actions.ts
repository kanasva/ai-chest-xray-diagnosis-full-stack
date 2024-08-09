"use server";

import { github, lucia, validateRequest } from "@/auth/lucia";
import { generateState } from "arctic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createServerAction } from "zsa";

export const loginWithGithub = createServerAction().handler(async () => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state, {
    scopes: ["user:email"],
  });

  cookies().set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return redirect(url.href);
});

// export const loginWithGoogle = createServerAction().handler(async () => {
//   const state = generateState();
//   const codeVerifier = generateCodeVerifier();
//   const url = await google.createAuthorizationURL(state, codeVerifier, {
//     scopes: ["profile", "email"],
//   });

//   cookies().set("google_oauth_state", state, {
//     path: "/",
//     secure: process.env.NODE_ENV === "production",
//     httpOnly: true,
//     maxAge: 60 * 10,
//     sameSite: "lax",
//   });

//   cookies().set("google_code_verifier", codeVerifier, {
//     path: "/",
//     secure: process.env.NODE_ENV === "production",
//     httpOnly: true,
//     maxAge: 60 * 10,
//     sameSite: "lax",
//   });
//   redirect(url.href);
// });

export const getUser = cache(async () => {
  const { user } = await validateRequest();
  return user;
});

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}
