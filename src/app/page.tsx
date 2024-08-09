import { getUser } from "@/auth/actions";
import LoginForm from "./_components/LoginForm";
import Main from "./_components/Main";
import Link from "next/link";

export default async function Home() {
  const user = await getUser();

  // if not authenticated
  if (!user) {
    return (
      // wraper full width
      <div className="flex w-full flex-1 items-center justify-center bg-surface">
        {/* content area max-w-1280 */}
        <main className="flex max-w-[1280px] flex-1 flex-col items-center justify-between p-4 sm:p-6">
          <div className="flex flex-col items-center justify-between gap-4">
            <p>Please login to get diagnosis</p>
            <LoginForm />
            <Link
              href="/demo"
              className="mt-4 text-sm text-surface-on-var sm:hidden"
            >
              See a demo
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // authenticated user
  return (
    // wraper full width
    <div className="flex w-full flex-1 justify-center bg-surface">
      {/* content area max-w-1280 */}
      <main className="flex max-w-[1280px] flex-1 justify-center p-4 sm:p-6">
        <Main />
      </main>
    </div>
  );
}
