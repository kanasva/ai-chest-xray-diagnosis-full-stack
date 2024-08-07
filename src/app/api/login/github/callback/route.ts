import { github } from "@/auth/lucia";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { createUserUseCase, getUserByGitHubIdUseCase } from "@/use-cases/users";
import { createSessionAndCookie } from "@/auth/utils";

export interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
  email: string;
}

interface Email {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingUser = await getUserByGitHubIdUseCase(githubUser.id);
    if (existingUser) {
      await createSessionAndCookie(existingUser.id);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    if (!githubUser.email) {
      const githubUserEmailResponse = await fetch(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        },
      );
      const githubUserEmails = await githubUserEmailResponse.json();

      githubUser.email = getPrimaryEmail(githubUserEmails);
    }

    // Create the new user
    const newUserId = await createUserUseCase(
      "github",
      githubUser.id,
      githubUser.login,
      githubUser.email,
      githubUser.avatar_url,
    );

    await createSessionAndCookie(newUserId);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

function getPrimaryEmail(emails: Email[]): string {
  const primaryEmail = emails.find((email) => email.primary);
  return primaryEmail!.email;
}
