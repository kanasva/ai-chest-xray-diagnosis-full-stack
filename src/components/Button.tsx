"use client";

import React from "react";
import {
  composeRenderProps,
  Button as RACButton,
  ButtonProps as RACButtonProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "./react-aria";

export interface ButtonProps extends Omit<RACButtonProps, "formAction"> {
  variant?: "none" | "primary" | "secondary" | "destructive" | "icon";
  formAction?: undefined | string | (() => Promise<any>);
}

let button = tv({
  extend: focusRing,
  base: "px-4 py-2 text-sm text-center rounded-lg cursor-pointer",
  variants: {
    variant: {
      none: "p-0 text-base",
      primary:
        "text-white bg-primary pressed:bg-primary-pressed data-[hovered]:bg-primary-hovered",
      secondary:
        "text-secondary-on bg-secondary pressed:bg-secondary-pressed data-[hovered]:bg-secondary-hovered",
      destructive:
        "bg-error data-[hovered]:bg-error-hovered pressed:bg-error-pressed text-white",
      icon: "border-0 p-1 flex items-center justify-center text-gray-600 hover:bg-black/[5%] pressed:bg-black/10 dark:text-zinc-400 dark:hover:bg-white/10 dark:pressed:bg-white/20 disabled:bg-transparent",
    },
    isDisabled: {
      true: "opacity-40",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...(props as Omit<ButtonProps, "formAction">)}
      className={composeRenderProps(props.className, (className, renderProps) =>
        button({ ...renderProps, variant: props.variant, className }),
      )}
    />
  );
}
