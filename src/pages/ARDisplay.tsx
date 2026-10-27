import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  X,
  CameraOff,
  Sparkles,
  AlertTriangle,
  Clock,
  Layers,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { medicines } from '../data/medicines';
import type { Medicine } from '../types/medicine';
import { useAppStore } from '../store';

export const ARDisplay: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedMedicineId, setSelectedMedicineId, setScanStatus } = useAppStore();

  const queryId = searchParams.get('id');
  const targetId = queryId || selectedMedicineId || 'med-001';

  const medicine: Medicine =
    medicines.find((m) => m.id === targetId) || medicines[0];

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [activeOverlayTab, setActiveOverlayTab] = useState<'dosage' | 'precautions' | 'uses'>('dosage');
  const [overlayExpanded, setOverlayExpanded] = useState<boolean>(true);

  // Stop camera tracks cleanly
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setScanStatus('idle');
  };

  // Attempt to start camera feed on mount
  useEffect(() => {
    let isMounted = true;
    setSelectedMedicineId(medicine.id);

    async function initCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (isMounted) setCameraError('Camera API is not supported in this browser.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
        setScanStatus('scanning');
      } catch {
        if (isMounted) {
          setCameraActive(false);
          setCameraError('Camera preview disabled or permission not granted. Showing simulated AR environment.');
        }
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [medicine.id, setSelectedMedicineId, setScanStatus]);

  const handleClose = () => {
    stopCamera();
    navigate('/scanner');
  };

  return (
    <div className="relative min-h-[calc(100vh-10rem)] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between">
      {/* 1. Camera Area */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        {/* Live Camera Video */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
        />

        {/* Fallback Camera Placeholder */}
        {!cameraActive && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-teal-400 mb-3">
              <CameraOff className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-base font-bold text-slate-200">Simulated AR Viewport</h2>
            <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
              {cameraError || 'Live camera stream inactive. Displaying simulated AR spatial canvas.'}
            </p>

            {(medicine.imagePath || medicine.imageUrl) && (
              <div className="mt-6 opacity-30 max-w-xs rounded-xl overflow-hidden border border-slate-700">
                <img src={medicine.imagePath || medicine.imageUrl} alt={medicine.name} className="w-full h-36 object-cover" />
              </div>
            )}
          </div>
        )}

        {/* 3D AR Spatial Bounding Box */}
        <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 border-2 border-teal-400/70 border-dashed rounded-3xl pointer-events-none flex items-center justify-center">
          <div className="absolute -top-3 left-4 px-2.5 py-0.5 bg-[#0D9488] text-white text-[10px] font-bold rounded-md uppercase tracking-wider shadow-sm">
            Target Anchor Box
          </div>
          <div className="w-12 h-12 rounded-full border border-teal-400/50 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-teal-300" />
          </div>
        </div>
      </div>

      {/* 2. Top HUD Bar: Close Button & Scan Status */}
      <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/70 to-transparent">
        {/* Scan Status Badge */}
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
          <div>
            <span className="font-bold text-slate-200">Scan Status: </span>
            <span className="text-teal-300 font-mono text-[11px]">
              {cameraActive ? 'Target Tracking Engine Standby' : 'Simulated View (No Camera)'}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/20 hover:bg-white/30 active:scale-95 text-white text-xs font-bold rounded-xl backdrop-blur-md border border-white/20 transition-all shadow-md"
          title="Exit AR View"
        >
          <X className="w-4 h-4" />
          <span>Close AR</span>
        </button>
      </div>

      {/* 3. Medicine Information Overlay */}
      <div className="relative z-20 p-4 sm:p-6 flex justify-center pointer-events-auto">
        <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/40 text-slate-900 space-y-3">
          {/* Overlay Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-slate-900">
                  {medicine.name}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-[#2563EB]">
                  {medicine.strength}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {medicine.genericName} • {medicine.dosageForm}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setOverlayExpanded(!overlayExpanded)}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                title={overlayExpanded ? 'Collapse info' : 'Expand info'}
              >
                {overlayExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {overlayExpanded && (
            <>
              {/* Tab Selector */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveOverlayTab('dosage')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    activeOverlayTab === 'dosage'
                      ? 'bg-white text-[#2563EB] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dosage
                </button>
                <button
                  onClick={() => setActiveOverlayTab('precautions')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    activeOverlayTab === 'precautions'
                      ? 'bg-white text-[#F59E0B] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Precautions
                </button>
                <button
                  onClick={() => setActiveOverlayTab('uses')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    activeOverlayTab === 'uses'
                      ? 'bg-white text-[#0D9488] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Uses
                </button>
              </div>

              {/* Tab Body */}
              <div className="min-h-[70px] text-xs">
                {activeOverlayTab === 'dosage' && (
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Intake Instructions:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {medicine.dosageInfo}
                    </p>
                  </div>
                )}

                {activeOverlayTab === 'precautions' && (
                  <div className="space-y-1">
                    <div className="font-semibold text-amber-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Precautions & Safety:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {medicine.precautions[0]}
                    </p>
                  </div>
                )}

                {activeOverlayTab === 'uses' && (
                  <div className="space-y-1">
                    <div className="font-semibold text-teal-800 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#0D9488]" />
                      <span>Approved Indications:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {medicine.uses.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Links */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  to={`/library/${medicine.id}`}
                  onClick={stopCamera}
                  className="font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  Open Full Monograph <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/reminders?medId=${medicine.id}`}
                  onClick={stopCamera}
                  className="px-3 py-1 bg-[#2563EB] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule Dose
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
