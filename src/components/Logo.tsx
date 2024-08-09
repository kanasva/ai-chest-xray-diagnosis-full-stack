"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "@/app/providers";

export default function Logo() {
  const { setGradCamName, setOriginalImage, setPrediction } = useAppContext();
  return (
    <Link
      href="/"
      className="flex w-max items-center hover:opacity-100"
      onClick={() => {
        setOriginalImage(null);
        setPrediction(null);
        setGradCamName(null);
      }}
    >
      <Image
        src="/logo.webp"
        width={40}
        height={40}
        alt="AI Chest X-ray Diagnosis Logo"
      />
      <span className="pl-2 font-medium hover:opacity-100">
        AI Chest X-ray Diagnosis
      </span>
    </Link>
  );
}
