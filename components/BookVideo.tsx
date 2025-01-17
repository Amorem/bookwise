"use client";
import config from "@/lib/config";
import { IKVideo, ImageKitProvider } from "imagekitio-next";

export default function BookVideo({ videoUrl }: { videoUrl: string }) {
  console.log(videoUrl);
  return (
    <ImageKitProvider
      publicKey={config.env.imageKit.publicKey}
      urlEndpoint={config.env.imageKit.urlEndpoint}
    >
      <IKVideo path={videoUrl} controls className="w-full rounded-xl" />
    </ImageKitProvider>
  );
}
