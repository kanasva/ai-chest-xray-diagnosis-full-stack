import { getPrediction } from "@/data-access/prediction";
import {
  getAndUpdateGlobalQuotaUseCase,
  getAndUpdateUserQuotaUseCase,
  updateUserQuotaUseCase,
} from "./quotas";
import { deductGlobalQuota } from "@/data-access/quotas";

export async function getPredictionUseCase(userId: number, base64Img: string) {
  const globalQuota = await getAndUpdateGlobalQuotaUseCase();
  if (globalQuota < 1) {
    throw new Error(
      "The app-wide quota for this month has been exhausted. Please try again next month.",
    );
  }

  const userQuota = await getAndUpdateUserQuotaUseCase(userId);
  if (userQuota < 1) {
    throw new Error(
      "Your daily quota has been exhausted. Please try again tomorrow.",
    );
  }

  let prediction;
  try {
    prediction = await getPrediction(base64Img);
  } catch (e) {
    throw new Error("AI error");
  }

  if (prediction.inDistribution === false) {
    await updateUserQuotaUseCase(userId, userQuota - 1);
    await deductGlobalQuota();
    throw new Error(
      "The image doesn't look like the X-rays I was trained on. It might need cropping.",
    );
  }

  await updateUserQuotaUseCase(userId, userQuota - 1);
  await deductGlobalQuota();

  return prediction;
}
