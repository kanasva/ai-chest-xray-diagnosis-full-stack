import {
  getGlobalQuota,
  getUserQuota,
  updateGlobalQuota,
  updateUserQuota,
} from "@/data-access/quotas";
import { isSameDay, isSameMonth } from "date-fns";

export async function getAndUpdateQuotaUseCase(userId: number) {
  const globalQuota = await getAndUpdateGlobalQuotaUseCase();
  if (globalQuota < 1) {
    return 0;
  }
  const userQuota = await getAndUpdateUserQuotaUseCase(userId);
  return userQuota;
}

export async function getAndUpdateGlobalQuotaUseCase() {
  let globalQuota = await getGlobalQuota();
  const currentDate = new Date();

  const isSameMonthRes = isSameMonth(globalQuota.updateAt, currentDate);
  if (!isSameMonthRes) {
    globalQuota.value = await updateGlobalQuota(100);
    return globalQuota.value;
  }

  return globalQuota.value;
}

export async function getAndUpdateUserQuotaUseCase(userId: number) {
  const userQuota = await getUserQuota(userId);
  const currentDate = new Date();

  const isSameDayRes = isSameDay(userQuota.updatedAt, currentDate);
  if (!isSameDayRes) {
    const updatedUserQuota = await updateUserQuota(userId, 10);
    return updatedUserQuota.remainingQuota;
  }

  return userQuota.remainingQuota;
}

export async function updateUserQuotaUseCase(
  userId: number,
  newRemainingQuota: number,
) {
  await updateUserQuota(userId, newRemainingQuota);
}
