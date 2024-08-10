"use server";

import { getUser } from "@/auth/actions";
import { createServerActionProcedure } from "zsa";
import z from "zod";
import { getPredictionUseCase } from "@/use-cases/prediction";
import { Prediction } from "@/data-access/prediction";

const authedProcedure = createServerActionProcedure().handler(async () => {
  try {
    const user = await getUser();

    if (!user) {
      throw Error("User not authenticated");
    }

    return user;
  } catch {
    throw Error("Cannot verify user");
  }
});

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const getPrediction = authedProcedure
  .createServerAction()
  .input(
    z.object({
      img: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: "Max image size is 8MB.",
        })
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "Only JPG and PNG formats are supported.",
        ),
    }),
    {
      type: "formData",
    },
  )
  .handler(async ({ input, ctx }) => {
    const img = input.img;
    const base64Img = await convertImgToBase64(img);
    const payload = JSON.stringify({
      base64Img: base64Img,
      reconstructionThreshold: 8000,
      ssimThreshold: 0.62,
      gradCamThreshold: 0.44,
    });

    let prediction;
    try {
      prediction = await Promise.race([
        getPredictionUseCase(ctx.id, payload),
        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  "The operation timed out. This might be due to a cold start. Please try again.",
                ),
              ),
            60 * 1000,
          ),
        ),
      ]);
    } catch (e) {
      throw (e as Error).message;
    }

    return prediction as Prediction;

    // Helper functions
    async function convertImgToBase64(imgFile: FormDataEntryValue | null) {
      if (!(imgFile instanceof File)) {
        throw "Invalid file type or file not found";
      }

      const imgBuffer = await imgFile.arrayBuffer();
      const base64Img = Buffer.from(imgBuffer).toString("base64");
      return base64Img;
    }
  });
