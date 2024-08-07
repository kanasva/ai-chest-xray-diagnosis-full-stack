"use client";

import { Button } from "@/components/Button";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import { useServerAction } from "zsa-react";
import { loginWithGithub } from "@/auth/actions";
// import { loginWithGoogle } from "@/auth/actions";

export default function LoginForm() {
  // const { isPending, execute } = useServerAction(loginWithGoogle);
  const { isPending, executeFormAction } = useServerAction(loginWithGithub);

  return (
    <form className="flex flex-col items-center justify-center gap-4">
      <Button
        isDisabled={isPending}
        type="submit"
        className="flex items-center justify-center gap-4 shadow-md"
        formAction={executeFormAction}
      >
        {isPending ? (
          <LoaderCircle className="h-5 w-5 animate-spin" />
        ) : (
          <Image
            src="/github-logo.svg"
            width={20}
            height={20}
            alt="GitHub logo"
          />
        )}
        Login with GitHub
      </Button>
    </form>
  );
}
