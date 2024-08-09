"use client";

import { useAppContext } from "../providers";
import { useEffect } from "react";

export default function RemainingQuota({
  remainingQuotaProp,
}: {
  remainingQuotaProp: number;
}) {
  const { remainingQuota, setRemainingQuota } = useAppContext();

  // use for updating remainingQuota for the first render
  useEffect(() => {
    setRemainingQuota(remainingQuotaProp);
  }, [setRemainingQuota, remainingQuotaProp]);

  return (
    // fast render from server comp: remainingQuotaProp, then use client
    <>{remainingQuota ? remainingQuota : remainingQuotaProp}</>
  );
}
