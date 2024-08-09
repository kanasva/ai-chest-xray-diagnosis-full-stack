"use server";

import { getUser } from "@/auth/actions";
import { createServerActionProcedure } from "zsa";
import z from "zod";
import { getPredictionUseCase } from "@/use-cases/prediction";

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

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 8MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const getPrediction = authedProcedure
  .createServerAction()
  .input(
    z.object({
      img: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: "Max image size is 4MB.",
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
  .timeout(1 * 60 * 1000) // Set the timeout 1 min
  .retry({
    maxAttempts: 1,
  })
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
      prediction = await getPredictionUseCase(ctx.id, payload);
    } catch (e) {
      throw (e as Error).message;
    }
    return prediction;

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
