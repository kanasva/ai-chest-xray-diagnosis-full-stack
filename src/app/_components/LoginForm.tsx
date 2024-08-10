"use client";

import { Button } from "@/components/Button";
import { LoaderCircle } from "lucide-react";
import { useServerAction } from "zsa-react";
import { loginWithGithub } from "@/auth/actions";
import GitHubLogo from "@/components/GitHubLogo";
import { DialogTrigger, Heading } from "react-aria-components";
import { Modal } from "@/components/Modal";
import { Dialog } from "@/components/Dialog";

export default function LoginForm() {
  const { isPending, execute } = useServerAction(loginWithGithub);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <DialogTrigger>
        <Button className="flex items-center justify-center gap-4 shadow-md">
          <GitHubLogo className="w-5 fill-white" />
          Login with GitHub
        </Button>
        <Modal isDismissable>
          <Dialog>
            {({ close }) => (
              <form className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-lg font-medium">Disclaimer</h2>
                  <p className="text-secondary">
                    This tool is not for medical use.
                  </p>
                </div>

                <Button
                  onPress={async () => {
                    await execute();
                    close();
                  }}
                  isDisabled={isPending}
                  type="submit"
                  className="flex items-center justify-center gap-4 shadow-md"
                >
                  {isPending ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <GitHubLogo className="w-5 fill-white" />
                  )}
                  Accept and Login with GitHub
                </Button>
              </form>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
    </div>
  );
}
