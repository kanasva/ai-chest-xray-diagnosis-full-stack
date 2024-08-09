import { google } from "@/auth/lucia";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { createSessionAndCookie } from "@/auth/utils";
import { createUserUseCase, getUserByEmailUseCase } from "@/use-cases/users";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookies().get("google_code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const googleUser: GoogleUser = await response.json();

    // Check if the user exist then create cookies and return
    const existingUser = await getUserByEmailUseCase(googleUser.email);
    if (existingUser) {
      await createSessionAndCookie(existingUser.id);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    // If more social login needed, implement between here to put the new social id in

    // Create the new user
    const newUserId = await createUserUseCase(
      "google",
      googleUser.sub,
      googleUser.name,
      googleUser.email,
      googleUser.picture,
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

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}
