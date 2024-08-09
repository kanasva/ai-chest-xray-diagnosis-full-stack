"use client";

import { Button } from "@/components/Button";
import { LoaderCircle } from "lucide-react";
import { useServerAction } from "zsa-react";
import { loginWithGithub } from "@/auth/actions";
import GitHubLogo from "@/components/GitHubLogo";

export default function LoginForm() {
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
          <GitHubLogo className="w-5 fill-white" />
        )}
        Login with GitHub
      </Button>
    </form>
  );
}
