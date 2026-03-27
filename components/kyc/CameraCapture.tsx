"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { LuCamera, LuRefreshCw, LuCheck, LuX, LuLoader } from "react-icons/lu";

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      streamRef.current = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Impossible d'accéder à la caméra. Vérifiez vos permissions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      fetch(capturedImage)
        .then((res) => res.blob())
        .then((blob) => onCapture(blob));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-dark-800 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
        >
          <LuX size={24} />
        </button>

        <div className="aspect-video bg-neutral-900 relative flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 text-white">
              <LuLoader className="animate-spin" size={48} />
              <p className="font-bold tracking-widest text-sm uppercase">Initialisation...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-6 text-center px-8">
              <div className="p-4 bg-red-500/20 rounded-2xl text-red-500 border border-red-500/30">
                <LuX size={48} />
              </div>
              <p className="text-white font-bold">{error}</p>
              <button
                onClick={startCamera}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/30"
              >
                Réessayer
              </button>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover scale-x-[-1] ${capturedImage ? "hidden" : "block"}`}
          />

          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover scale-x-[-1]"
            />
          )}

          {/* Guide Overlay for Selfie */}
          {!capturedImage && !isLoading && !error && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ border: '40px solid rgba(0,0,0,0.4)' }}>
               <div className="w-[80%] h-[80%] border-4 border-dashed border-white/30 rounded-full"></div>
            </div>
          )}
        </div>

        <div className="p-8 bg-dark-900 flex justify-center gap-6 items-center border-t border-white/5">
          {!capturedImage ? (
            <button
              onClick={capturePhoto}
              disabled={isLoading || !!error}
              className="w-20 h-20 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              <LuCamera size={36} />
            </button>
          ) : (
            <>
              <button
                onClick={retakePhoto}
                className="flex items-center gap-3 px-8 py-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black transition-all active:scale-95"
              >
                <LuRefreshCw size={20} />
                Reprendre
              </button>
              <button
                onClick={confirmPhoto}
                className="flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black shadow-2xl shadow-primary/30 transition-all active:scale-95 group"
              >
                Valider
                <LuCheck size={20} className="group-hover:scale-125 transition-transform" />
              </button>
            </>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
