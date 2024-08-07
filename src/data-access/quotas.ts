import { db } from "@/db/db-connection";
import { config, userQuotas } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function insertUserQuota(userId: number) {
  await db.insert(userQuotas).values({
    userId: userId,
    remainingQuota: 10,
  });
}

export async function getGlobalQuota() {
  const [globalQuota] = await db
    .select({
      value: sql<number>`CAST(${config.value} AS INTEGER)`,
      updateAt: config.createAt,
    })
    .from(config)
    .where(eq(config.key, "globalQuota"));
  return globalQuota;
}

export async function getUserQuota(userId: number) {
  const [userQuota] = await db
    .select()
    .from(userQuotas)
    .where(eq(userQuotas.userId, userId));
  return userQuota;
}

export async function updateGlobalQuota(quota: number) {
  const [res] = await db
    .update(config)
    .set({ value: quota.toString() })
    .where(eq(config.key, "globalQuota"))
    .returning({ value: sql<number>`CAST(${config.value} AS integer)` });
  return res.value;
}

export async function deductGlobalQuota() {
  await db
    .update(config)
    .set({ value: sql<number>`CAST(${config.value} AS integer) - 1` })
    .where(eq(config.key, "globalQuota"));
}

export async function updateUserQuota(
  userId: number,
  newRemainingQuota: number,
) {
  const [res] = await db
    .update(userQuotas)
    .set({
      remainingQuota: newRemainingQuota,
    })
    .where(eq(userQuotas.userId, userId))
    .returning({ remainingQuota: userQuotas.remainingQuota });
  return res;
}
