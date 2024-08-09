"use client";

import { Button } from "@/components/Button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { FileTrigger, Text } from "react-aria-components";
import DropZone from "./DropZone";

export default function UploadImg({
  handleUpload,
}: {
  handleUpload: (img: File) => void;
}) {
  const defaultUploadPrompt = "Drop or select an image";
  const [uploadPrompt, setUploadPrompt] = useState(defaultUploadPrompt);

  function handleFileTrigger(e: FileList | null) {
    if (e) {
      const img = e[0];
      handleUpload(img);
    }
  }

  function setUploadPromptProp(text: string = defaultUploadPrompt) {
    setUploadPrompt(text);
  }

  return (
    <form className="h-full w-full">
      <DropZone
        handleUpload={handleUpload}
        setUploadPromptProp={setUploadPromptProp}
      >
        <FileTrigger
          acceptedFileTypes={["image/png", "image/jpeg"]}
          onSelect={(e) => handleFileTrigger(e)}
        >
          <Button
            variant="none"
            className="flex h-full w-full items-center justify-center gap-2"
          >
            <div className="flex gap-2">
              <Text slot="label">
                <span>{uploadPrompt}</span>
              </Text>
              <Upload />
            </div>
          </Button>
        </FileTrigger>
      </DropZone>
    </form>
  );
}
