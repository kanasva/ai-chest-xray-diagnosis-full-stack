"use client";

import { Button } from "@/components/Button";
import { Menu, MenuItem } from "@/components/Menu";
import { Popover } from "@/components/Popover";
import { Separator } from "@/components/Separator";
import { MenuIcon } from "lucide-react";
import { MenuTrigger } from "react-aria-components";
import Image from "next/image";
import { User } from "lucia";
import { logout } from "@/auth/actions";
import { useAppContext } from "../providers";
import { useEffect } from "react";

export default function MobileMenu({
  user,
  remainingQuotaProp,
}: {
  user: User | null;
  remainingQuotaProp: number;
}) {
  const { remainingQuota, setRemainingQuota } = useAppContext();

  useEffect(() => {
    setRemainingQuota(remainingQuotaProp);
  }, [setRemainingQuota, remainingQuotaProp]);

  return (
    <MenuTrigger>
      <Button
        variant="secondary"
        aria-label="Menu"
        className="flex items-center justify-center p-2 text-xl"
      >
        <MenuIcon />
      </Button>
      <Popover className="min-w-[180px]">
        <Menu>
          <MenuItem className="hover:opacity-100" href="/demo">
            Demo
          </MenuItem>
          <MenuItem href="/facts" className="hover:opacity-100">
            Facts
          </MenuItem>
          {user && (
            <>
              <Separator />
              <MenuItem isDisabled className="text-black">
                <div className="flex w-full items-center justify-between">
                  <span className="text text-surface-on/40">
                    Quota remain:{" "}
                    {remainingQuota ? remainingQuota : remainingQuotaProp}
                  </span>
                  <Image
                    src={user.avatarUrl}
                    width={35}
                    height={35}
                    alt="Avatar"
                    className="rounded-full"
                  />
                </div>
              </MenuItem>
              <MenuItem
                onAction={logout}
                className="bg-error-container text-error-container-on data-[focused]:bg-error-container-hovered pressed:bg-error-container-pressed"
              >
                Logout
              </MenuItem>
            </>
          )}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
