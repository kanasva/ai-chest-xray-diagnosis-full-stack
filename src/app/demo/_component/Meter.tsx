import React, { useEffect, useState } from "react";
import {
  Meter as AriaMeter,
  MeterProps as AriaMeterProps,
  TooltipTrigger,
} from "react-aria-components";
import { Label } from "@/components/Field";
import { composeTailwindRenderProps } from "@/components/react-aria";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/Button";
import { useHover } from "react-aria";
import { Prediction } from "@/data-access/prediction";

export interface MeterProps extends AriaMeterProps {
  label: string;
  isOpen?: boolean;
  prediction: Prediction;
  gradCamName: string | null;
  setGradCamName: React.Dispatch<React.SetStateAction<string | null>>;
}

export function Meter({
  label,
  prediction,
  gradCamName,
  setGradCamName,
  ...props
}: MeterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { hoverProps, isHovered } = useHover({});

  useEffect(() => {
    isHovered ? setIsOpen(true) : setIsOpen(false);
  }, [isHovered]);

  return (
    <AriaMeter
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1",
      )}
    >
      {({ percentage, valueText }) => (
        <>
          {/* Container to control hover and click */}
          <div className="flex h-[24px] items-center justify-between gap-4">
            {/* Bar */}
            <div
              {...hoverProps}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              className="flex h-full flex-1 items-center"
            >
              <div
                className="relative h-2 w-full rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, hsl(140, 50%, 35%), white 50%, hsl(0, 40%, 48%))",
                }}
              >
                <TooltipTrigger isOpen={isOpen}>
                  {/* Indicator */}
                  <Button
                    onPress={() => setIsOpen(!isOpen)}
                    variant="none"
                    className="h-4 w-2 -translate-x-1/2 -translate-y-1/2 transform cursor-default rounded-full bg-secondary opacity-100"
                    style={{
                      position: "absolute",
                      left: percentage + "%",
                      top: "50%",
                    }}
                  />
                  <Tooltip className="pointer-events-none">{valueText}</Tooltip>
                </TooltipTrigger>
              </div>
            </div>
            {/* Label */}
            <div className="w-[170px] flex-none text-nowrap text-left">
              {prediction?.gradCam?.[label] ? (
                <Label
                  className={
                    `cursor-pointer text-secondary ` +
                    `${gradCamName === label ? "font-bold" : "font-normal"}`
                  }
                >
                  <Button
                    variant="none"
                    onPress={() => {
                      if (!gradCamName) {
                        setGradCamName(label);
                      } else if (gradCamName === label) {
                        setGradCamName(null);
                      } else if (gradCamName !== label) {
                        setGradCamName(label);
                      }
                    }}
                    className="w-full text-left data-[hovered]:text-secondary-hovered data-[pressed]:text-secondary-pressed"
                  >
                    {label}
                  </Button>
                </Label>
              ) : (
                <Label className="cursor-text text-secondary/60">{label}</Label>
              )}
            </div>
          </div>
        </>
      )}
    </AriaMeter>
  );
}
