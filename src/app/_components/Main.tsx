"use client";

import { Button } from "@/components/Button";
import { Meter } from "./Meter";
import UploadImg from "./UploadImg";
import { getPrediction } from "../actions";
import { useServerAction } from "zsa-react";
import { useAppContext } from "../providers";

export default function Main() {
  const { execute, error: predictionErr } = useServerAction(getPrediction);
  const {
    setRemainingQuota,
    prediction,
    setPrediction,
    originalImage,
    setOriginalImage,
    gradCamName,
  } = useAppContext();

  async function handleUpload(img: File) {
    setOriginalImage(img);
    const formData = new FormData();
    formData.append("img", img);
    const [prediction, err] = await execute(formData);
    if (!err) {
      setPrediction(prediction);
    }
    setRemainingQuota((prev) => prev && prev - 1);
  }

  // Upload an image first
  if (!originalImage) {
    return (
      <>
        <UploadImg handleUpload={handleUpload} />
      </>
    );
  }

  // Show prediction
  return (
    <>
      <div className="flex w-full flex-col items-center gap-4 sm:gap-6 lg:flex-row">
        {/* Original img */}
        <div className="relative w-full md:flex-1">
          <img
            src={URL.createObjectURL(originalImage)}
            alt="Uploaded Image"
            className="w-full rounded-md"
          />
          <div
            className={`absolute inset-0 h-full w-full rounded-md transition-opacity duration-300 ${gradCamName ? "opacity-50" : "opacity-0"}`}
          >
            {gradCamName && (
              <img
                src={`data:image/png;base64,${prediction?.gradCam?.[gradCamName]}`}
                alt="Uploaded Image"
                className={`absolute inset-0 h-full w-full rounded-md`}
              />
            )}
          </div>
        </div>

        {/* Prediction */}
        <div className="flex w-full max-w-[500px] flex-col items-center gap-4 lg:w-[340px]">
          {prediction ? (
            <>
              <div className="w-full">
                {/* Top legend */}
                <div className="flex justify-between gap-4">
                  <div className="flex flex-1 justify-between text-xs text-surface-on-var">
                    <span className="flex-1">Healthy</span>
                    <span className="flex-1 text-center">Uncertain</span>
                    <span className="flex-1 text-right">Risk</span>
                  </div>
                  <span className="w-[170px]"></span>
                </div>
                {/* Meters */}
                {prediction.prediction.map((item, index) => (
                  <Meter key={index} label={item.name} value={item.value} />
                ))}
              </div>
              {/* New img button */}
              <Button
                onPress={() => {
                  setOriginalImage(null);
                  setPrediction(null);
                }}
                className="w-32"
              >
                New Image
              </Button>
            </>
          ) : (
            // Loading
            <div className="relative h-[500px] w-full rounded-md">
              <div
                className={`absolute inset-0 rounded-md ${predictionErr?.data ? "bg-error-container" : "animate-pulse bg-surface-container-high"}`}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <p className="px-4 text-center text-surface-on-var">
                  {predictionErr ? (
                    predictionErr.data
                  ) : (
                    <>
                      {"Processing..."} <br />
                      {"This may take up to one minute."}
                    </>
                  )}
                </p>
                {predictionErr && (
                  <Button
                    variant="destructive"
                    onPress={() => {
                      setOriginalImage(null);
                      setPrediction(null);
                      // setGradcam(null);
                    }}
                    className="w-32"
                  >
                    New Image
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
