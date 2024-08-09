import Link from "next/link";
import Image from "next/image";
import MobileMenu from "../app/_components/MobileMenu";
import AvatarMenu from "../app/_components/AvatarMenu";
import { getUser } from "@/auth/actions";
import { getAndUpdateQuotaUseCase } from "@/use-cases/quotas";
import RemainingQuota from "../app/_components/RemainingQuota";
import Logo from "./Logo";

export default async function Header() {
  const user = await getUser();
  let remainingQuota = 0;
  if (user) {
    remainingQuota = await getAndUpdateQuotaUseCase(user.id);
  }

  return (
    <header className="flex w-full justify-center bg-surface-container">
      <nav className="flex w-[1280px] items-center justify-between px-4 py-4 text-surface-on sm:px-6">
        {/* Logo */}
        <div className="flex-1">
          <Logo />
        </div>

        {/* Mobile */}
        <div className="sm:hidden">
          <MobileMenu user={user} remainingQuotaProp={remainingQuota} />
        </div>

        {/* Desktop */}
        <div
          className={
            `hidden flex-1 sm:flex ` +
            `${user ? "sm:justify-center" : "sm:justify-end"}`
          }
        >
          <ul className="flex items-center justify-between gap-6 text-surface-on">
            <li>
              <Link href="/demo">Demo</Link>
            </li>
            <li>
              <Link href="/facts">Facts</Link>
            </li>
          </ul>
        </div>
        {/* Avatar button*/}
        {user && (
          <>
            <div className="hidden flex-1 items-center justify-end sm:flex">
              <span className="text-surface-on-var">
                Quota remain:{" "}
                <RemainingQuota remainingQuotaProp={remainingQuota} />
              </span>
              <AvatarMenu avatarSrc={user.avatarUrl} />
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
