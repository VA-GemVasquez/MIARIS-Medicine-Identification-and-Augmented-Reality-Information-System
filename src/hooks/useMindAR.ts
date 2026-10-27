import { useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import type { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import { useAppStore } from '../store';

export type AREngineStatus =
  | 'idle'
  | 'loading'
  | 'running'
  | 'stopped'
  | 'error';

export interface DetectedTarget {
  targetIndex: number;
  medicineId: string | null;
  timestamp: number;
}

export interface UseMindARReturn {
  status: AREngineStatus;
  errorMessage: string;
  detectedTarget: DetectedTarget | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  startAR: () => Promise<void>;
  stopAR: () => void;
}

/**
 * useMindAR — React hook wrapping MindAR Three.js image tracking.
 *
 * The hook:
 * 1. Dynamically imports mindar-image-three.prod.js (browser-only ESM).
 * 2. Mounts a Three.js WebGL renderer and camera fed by MindAR's video stream.
 * 3. Registers anchors for every target listed in the compiled .mind file.
 * 4. Fires onTargetFound / onTargetLost callbacks and maps indices to medicines.
 * 5. Cleans up the renderer, stream, and animation frame on stopAR / unmount.
 */
export function useMindAR(targetSrc: string): UseMindARReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mindARRef = useRef<MindARThree | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastDetectedIndexRef = useRef<number | null>(null);

  const [status, setStatus] = useState<AREngineStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [detectedTarget, setDetectedTarget] = useState<DetectedTarget | null>(null);

  const { setSelectedMedicineId, setScanStatus } = useAppStore.getState();

  const stopAR = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (mindARRef.current) {
      try {
        mindARRef.current.stop();
      } catch {
        // ignore stop errors
      }
      mindARRef.current = null;
    }
    lastDetectedIndexRef.current = null;
    setStatus('stopped');
    setScanStatus('stopped');
  }, [setScanStatus]);

  const startAR = useCallback(async () => {
    if (!containerRef.current) {
      setErrorMessage('AR container element is not mounted.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setScanStatus('scanning');

    try {
      // Dynamic import — browser-only, requires a DOM environment
      const mindARModule = await import(
        /* @vite-ignore */
        'mind-ar/dist/mindar-image-three.prod.js'
      ) as { MindARThree: new (options: import('mind-ar/dist/mindar-image-three.prod.js').MindARThreeOptions) => MindARThree };
      const { MindARThree: MindARThreeClass } = mindARModule;

      const mindar = new MindARThreeClass({
        container: containerRef.current,
        imageTargetSrc: targetSrc,
        maxTrack: 1,
        uiLoading: 'no',
        uiScanning: 'no',
        uiError: 'no',
        filterMinCF: 0.001,
        filterBeta: 0.001,
        warmupTolerance: 5,
        missTolerance: 5,
      });

      mindARRef.current = mindar;

      const { renderer, scene, camera } = mindar;

      // Add ambient + directional light so any 3D content is visible
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);

      // Register anchors for every mapped target index
      const { AR_TARGET_MAPPINGS } = await import('../features/ar/targetMappings');

      for (const mapping of AR_TARGET_MAPPINGS) {
        const anchor = mindar.addAnchor(mapping.targetIndex);
        const { targetIndex, medicineId } = mapping;

        anchor.onTargetFound = () => {
          // Prevent re-firing for the same target
          if (lastDetectedIndexRef.current === targetIndex) return;
          lastDetectedIndexRef.current = targetIndex;

          const detected: DetectedTarget = {
            targetIndex,
            medicineId,
            timestamp: Date.now(),
          };
          setDetectedTarget(detected);
          setSelectedMedicineId(medicineId);
          setScanStatus('scanning');
        };

        anchor.onTargetLost = () => {
          if (lastDetectedIndexRef.current === targetIndex) {
            lastDetectedIndexRef.current = null;
            // Keep detectedTarget visible until a new scan or manual reset
          }
        };
      }

      await mindar.start();
      setStatus('running');

      // Render loop
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    } catch (err: unknown) {
      const e = err as { message?: string };
      const msg = e.message || String(err);

      if (msg.includes('permission') || msg.includes('NotAllowed') || msg.includes('denied')) {
        setErrorMessage('Camera permission denied. Please allow camera access in your browser and reload.');
      } else if (msg.includes('NotFound') || msg.includes('no device')) {
        setErrorMessage('No camera device found on this computer or phone.');
      } else if (msg.includes('fetch') || msg.includes('targets.mind') || msg.includes('404')) {
        setErrorMessage(
          'AR target file not found at ' + targetSrc + '. Compile targets first (see TARGETS_GUIDE.md).'
        );
      } else {
        setErrorMessage(msg || 'Unknown AR engine error.');
      }

      setStatus('error');
      setScanStatus('error');

      if (mindARRef.current) {
        try { mindARRef.current.stop(); } catch { /* ignore */ }
        mindARRef.current = null;
      }
    }
  }, [targetSrc, setSelectedMedicineId, setScanStatus]);

  return {
    status,
    errorMessage,
    detectedTarget,
    containerRef,
    startAR,
    stopAR,
  };
}
