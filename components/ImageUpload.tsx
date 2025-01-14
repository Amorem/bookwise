"use client ";

import config from "@/lib/config";
import { IKImage, IKUpload, ImageKitProvider } from "imagekitio-next";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
const {
  env: {
    imageKit: { publicKey, urlEndpoint },
  },
} = config;

async function authenticator() {
  try {
    const response = await fetch(`${config.env.apiEndPoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `request failed with status: ${response.status} : ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error: any) {
    throw new Error(`authentication request failed: ${error.message}`);
  }
}

export default function ImageUpload({
  onFileChange,
}: {
  onFileChange: (filePath: string) => void;
}) {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onError = (error: any) => {
    console.error("upload failed", error);
    toast({
      title: "Image upload failed",
      description: "Your image could not be uploaded. Please try again",
      variant: "destructive",
    });
  };
  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);
    toast({
      title: "Image uploaded successfully",
      description: `${res.filePath} uploaded`,
    });
  };

  //   console.log("publicKey", publicKey);
  //   console.log("urlEndpoint", urlEndpoint);
  //   console.log("authenticator", authenticator);

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName="test-upload.png"
      />

      <button
        className="upload-btn"
        onClick={(e) => {
          e.preventDefault();
          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current.click();
          }
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className="text-base text-light-100">Upload a File</p>
        {file && <p className="upload-filename">{file.filePath}</p>}
      </button>
      {file && (
        <IKImage
          alt={file.filePath}
          path={file.filePath}
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  );
}
