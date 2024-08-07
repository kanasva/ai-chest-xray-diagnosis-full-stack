"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Meter } from "./Meter";
import demo from "../demo.jpg";
import demoJson from "../demo.json";
import { Prediction } from "@/data-access/prediction";
import LoginForm from "../../_components/LoginForm";
import { User } from "lucia";
import { useRouter } from "next/navigation";

export default function Main({ user }: { user: User | null }) {
  const [prediction, setPrediction] = useState<Prediction | null>(demoJson);
  const [gradCamName, setGradCamName] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex w-full flex-1 justify-center bg-surface">
      {/* content area max-w-1280 */}
      <main className="flex max-w-[1280px] flex-1 justify-center p-4 sm:p-6">
        <div className="flex w-full flex-col items-center gap-4 sm:gap-6 lg:flex-row">
          {/* Original img */}
          <div className="relative w-full md:flex-1">
            <img
              src={demo.src}
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
            {prediction && (
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
                    <Meter
                      key={index}
                      label={item.name}
                      value={item.value}
                      prediction={prediction}
                      gradCamName={gradCamName}
                      setGradCamName={setGradCamName}
                    />
                  ))}
                </div>
                {user ? (
                  <Button onPress={() => router.push("/")} className="w-32">
                    New Image
                  </Button>
                ) : (
                  <div className="my-2">
                    <LoginForm />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
