import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { ca } from "date-fns/locale";
import { promises as fs } from "fs";
import { join } from "path";

export async function getPrediction(payload: string): Promise<Prediction> {
  const client = new LambdaClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.ACCESS_KEY!,
    },
  });

  const command = new InvokeCommand({
    FunctionName: "chest-xray-prediction",
    InvocationType: "RequestResponse",
    LogType: "None",
    Payload: payload,
  });

  const res = await client.send(command);
  const resString = new TextDecoder().decode(res.Payload);
  const resObj = JSON.parse(resString);
  const resBodyObj = JSON.parse(resObj.body);
  if (resBodyObj.inDistribution === false) {
    return resBodyObj;
  }
  resBodyObj.prediction = serializePrediction(resBodyObj.prediction);

  if (Object.keys(resBodyObj.gradCam).length === 0) {
    resBodyObj.gradCam = null;
  } else {
    const updatedGradCam: Record<string, string> = {};
    for (const [key, base64Image] of Object.entries(resBodyObj.gradCam)) {
      let newKey = key.replace(/_/g, " ");
      newKey =
        newKey === "Enlarged Cardiomediastinum"
          ? "Enlarged Cardiomedia."
          : newKey;
      updatedGradCam[newKey] = base64Image as string;
    }
    resBodyObj.gradCam = updatedGradCam;
  }

  try {
    await savePredictionToFile(resBodyObj);
  } catch (e) {
    console.log(e);
  }

  return resBodyObj;

  // Helper functions

  async function savePredictionToFile(prediction: Prediction) {
    await fs.writeFile(
      "prediction.json",
      JSON.stringify(prediction, null, 2),
      "utf-8",
    );
  }

  function serializePrediction(prediction: { [key: string]: number }) {
    return Object.keys(prediction)
      .map((key) => {
        let name = key.replace(/_/g, " ");
        if (name === "Enlarged Cardiomediastinum") {
          name = "Enlarged Cardiomedia.";
        }
        return {
          name,
          value: Math.round(prediction[key] * 100),
        };
      })
      .sort((a, b) => b.value - a.value); // Sorting by value in descending order
  }
}

export interface Prediction {
  reconstructionError: number;
  ssim: number;
  inDistribution: boolean;
  prediction: {
    name: string;
    value: number;
  }[];
  gradCam: {
    [key: string]: string; // Base64 string
  } | null;
}
