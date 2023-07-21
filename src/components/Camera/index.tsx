/* eslint-disable @next/next/no-img-element */
"use client";

import { idbConfig } from "@/lib/indexedDB/config";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Webcam from "react-webcam";
import setupIndexedDB, { useIndexedDBStore } from "use-indexeddb";
import { videoConstraints } from "./constants/video";
import { PhotoProps } from "./types/photo.type";

function Camera() {
  const webcamRef = React.useRef<Webcam>(null);

  const [photos, setPhotos] = useState<PhotoProps[]>([]);

  const { add, getAll, deleteByID } = useIndexedDBStore("photos");

  const getPhotos = useCallback(async () => {
    const images = (await getAll()) as PhotoProps[];

    setPhotos(images);
  }, [getAll]);

  useEffect(() => {
    setupIndexedDB(idbConfig);

    getPhotos();
  }, [getPhotos]);

  async function removePhoto(id: number) {
    await deleteByID(id);

    getPhotos();
  }

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) return;

    add({
      photo: imageSrc,
    });

    getPhotos();
  };

  return (
    <div>
      <div className="relative flex align-middle justify-center">
        <Webcam
          audio={false}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        />

        <div className="absolute bottom-12 w-[200px] h-[60px] border-4 border-green-500"></div>
      </div>

      <div className="flex justify-center my-5">
        <button
          className="text-white font-semibold bg-orange-500 hover:bg-orange-400 w-[200px] h-[50px] rounded-md border-none"
          onClick={capture}
        >
          Tirar Foto
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {photos.map((photo) => (
          <img
            title="Clique para remover a foto"
            onClick={() => removePhoto(photo.id)}
            className="w-[200px] h-auto cursor-pointer"
            key={photo.id}
            src={photo.photo}
            alt="Foto"
          />
        ))}
      </div>
    </div>
  );
}

export default Camera;
