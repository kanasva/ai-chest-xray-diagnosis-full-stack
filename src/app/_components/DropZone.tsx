"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function DropZone({
  children,
  setUploadPromptProp,
  handleUpload,
}: {
  children: React.ReactNode;
  setUploadPromptProp: (text?: string) => void;
  handleUpload: (img: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isFileValid, setIsFileValid] = useState(true);
  const [dragCounter, setDragCounter] = useState(0);

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);

    // handle when drag to children
    setDragCounter((prevCounter) => {
      const newCounter = prevCounter + 1;
      if (newCounter === 1) {
        setIsDragging(true);
      }
      return newCounter;
    });

    // Safari cannot access file during drag
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      setUploadPromptProp("I am ready!");
      setIsFileValid(true);
      return;
    }

    // Validate the file
    const files = e.dataTransfer.items;
    if (
      files.length > 1 ||
      (files[0].type !== "image/jpeg" && files[0].type !== "image/png")
    ) {
      // File invalid, then:
      setIsFileValid(false);
      setUploadPromptProp("Please drop a JPG or PNG image");
      return;
    }

    // File valid
    setUploadPromptProp("I am ready!");
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    // handle when drag to children
    setDragCounter((prevCounter) => {
      const newCounter = prevCounter - 1;
      if (newCounter === 0) {
        setIsDragging(false);
        setIsFileValid(true);
        setUploadPromptProp();
      }
      return newCounter;
    });
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    // Safari cannot access file during drag
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      return;
    }

    const files = e.dataTransfer.items;
    if (
      files.length > 1 ||
      (files[0].type !== "image/jpeg" && files[0].type !== "image/png")
    ) {
      e.dataTransfer.dropEffect = "none"; // Disable drop
      return;
    }

    e.dataTransfer.dropEffect = "copy"; // Allow drop if conditions are met
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragCounter(0); // handle when drag to children

    // Check for safari, other browser will pass this before in handleDragEnter/Over
    const files = e.dataTransfer.files;
    if (
      files.length > 1 ||
      (files[0].type !== "image/jpeg" && files[0].type !== "image/png")
    ) {
      setIsFileValid(false);
      setUploadPromptProp("Please drop a JPG or PNG image");
      return;
    }

    // Pass everything, go through upload
    handleUpload(files[0]);
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={
        `h-full w-full rounded-lg border border-dashed border-surface-outline ` +
        `${isDragging && isFileValid ? "bg-surface-container" : ""} ` +
        `${isDragging && !isFileValid ? "bg-error-container" : ""} ` +
        `${!isDragging ? "hover:bg-surface-container" : ""}`
      }
    >
      {children}
    </div>
  );
}
