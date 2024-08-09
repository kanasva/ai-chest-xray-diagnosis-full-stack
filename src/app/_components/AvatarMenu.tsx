"use client";

import { MenuTrigger } from "react-aria-components";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Popover } from "@/components/Popover";
import { Menu, MenuItem } from "@/components/Menu";
import { logout } from "@/auth/actions";

export default function AvatarMenu({ avatarSrc }: { avatarSrc: string }) {
  return (
    <MenuTrigger>
      <Button
        variant="none"
        className="ml-4 mr-1 rounded-full outline-offset-[6px] ring-2 ring-gray-400 ring-offset-2"
      >
        <Image
          src={avatarSrc}
          width={40}
          height={40}
          alt="Avatar"
          className="rounded-full duration-300 hover:opacity-90"
        />
      </Button>
      <Popover placement="bottom right" className="min-w-[150px]">
        <Menu>
          <MenuItem
            className="bg-error-container text-error-container-on data-[focused]:bg-error-container-hovered data-[pressed]:bg-error-container-pressed"
            onAction={logout}
          >
            Logout
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
