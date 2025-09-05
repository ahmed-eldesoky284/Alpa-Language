import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { ObjectDetectionMode } from '../types.ts';

export interface CameraViewHandles {
  captureFrame: () => string | null;
}

interface CameraViewProps {
  stream: MediaStream;
  objectDetectionMode: ObjectDetectionMode;
  isFaceDetectionOn: boolean;
}

const CameraView = forwardRef<CameraViewHandles, CameraViewProps>(({ stream, objectDetectionMode, isFaceDetectionOn }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cocoModel, setCocoModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [faceModel, setFaceModel] = useState<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const [modelsLoading, setModelsLoading] = useState(true);
  const detectionIntervalRef = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    captureFrame: () => {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      if (video && video.readyState >= 3) { // Ensure video has data
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL('image/jpeg').split(',')[1];
        }
      }
      return null;
    },
  }));

  useEffect(() => {
    const loadModels = async () => {
      try {
        setModelsLoading(true);
        
        // FIX: The API for `@tensorflow-models/face-landmarks-detection` has been updated, causing errors.
        // Replaced deprecated `load` and `SupportedPackages` with `createDetector` and `SupportedModels`.
        // Also updated the detector configuration to match the new API requirements for the mediapipe runtime.
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig = {
            runtime: 'mediapipe',
            // FIX: The `VERSION` constant is no longer exported by `@tensorflow-models/face-landmarks-detection`.
            // The recommended solutionPath for mediapipe is now unversioned to fetch the latest model assets.
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
            refineLandmarks: true,
        };

        const [coco, face] = await Promise.all([
          cocoSsd.load(),
          faceLandmarksDetection.createDetector(model, detectorConfig)
        ]);
        
        setCocoModel(coco);
        setFaceModel(face);
      } catch (error) {
        console.error("Failed to load models:", error);
      } finally {
        setModelsLoading(false);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    const detect = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== 4) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const shouldDetectObjects = cocoModel && (objectDetectionMode !== ObjectDetectionMode.NONE);
      const shouldDetectFaces = faceModel && isFaceDetectionOn;

      if (!shouldDetectObjects && !shouldDetectFaces) return;

      if (shouldDetectObjects) {
        const predictions = await cocoModel.detect(video);
        predictions.forEach(prediction => {
          const shouldDraw = (objectDetectionMode === ObjectDetectionMode.OBJECTS && prediction.class !== 'person') ||
                             (objectDetectionMode === ObjectDetectionMode.PEOPLE && prediction.class === 'person') ||
                             (objectDetectionMode === ObjectDetectionMode.BOTH);

          if (shouldDraw) {
            ctx.beginPath();
            // FIX: The spread operator on `prediction.bbox` can cause a TypeScript error if the type
            // is not correctly inferred as a tuple. Using explicit arguments is a safer alternative.
            ctx.rect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
            ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
            ctx.stroke();
            ctx.fill();
            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
            ctx.fillText(`${prediction.class} (${Math.round(prediction.score * 100)}%)`, prediction.bbox[0], prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10);
          }
        });
      }

      if (shouldDetectFaces) {
        const faces = await faceModel.estimateFaces(video);
        faces.forEach(face => {
            // The v1 model returns keypoints directly, and we can estimate a box.
            // For simplicity, we'll draw the keypoints. A full bounding box
            // requires calculating min/max coordinates from keypoints.
             if (face.box) { // Some older versions provide a box
                const { xMin, yMin, width, height } = face.box;
                ctx.beginPath();
                ctx.rect(xMin, yMin, width, height);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
                ctx.stroke();
            } else if (face.keypoints) { // Fallback to drawing keypoints
                ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
                face.keypoints.forEach(keypoint => {
                    ctx.beginPath();
                    ctx.arc(keypoint.x, keypoint.y, 1, 0, 2 * Math.PI);
                    ctx.fill();
                });
            }
        });
      }
    };

    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    detectionIntervalRef.current = window.setInterval(detect, 100);

    return () => {
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, [objectDetectionMode, isFaceDetectionOn, cocoModel, faceModel, stream]);

  return (
    <div className="relative my-4 aspect-video max-w-full mx-auto bg-black rounded-lg overflow-hidden shadow-lg">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      {modelsLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <p className="text-white text-lg">Loading AI models...</p>
        </div>
      )}
    </div>
  );
});

export default CameraView;