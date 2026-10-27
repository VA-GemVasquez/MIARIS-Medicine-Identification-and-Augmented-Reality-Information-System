import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  CameraOff,
  Scan,
  Search,
  AlertCircle,
  Info,
  ArrowRight,
  Loader2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AROverlayCard } from '../components/ar/AROverlayCard';
import { ARManualSearch } from '../components/ar/ARManualSearch';
import { useMindAR } from '../hooks/useMindAR';
import { medicines } from '../data/medicines';
import type { Medicine } from '../types/medicine';

/**
 * Scanner page — MindAR-powered camera-based image-target recognition.
 *
 * States:
 *  idle     → Camera not started. Shows start button.
 *  loading  → MindAR engine initialising, target file being fetched.
 *  running  → Camera live. MindAR scanning for targets.
 *  stopped  → Camera released after Stop Scan.
 *  error    → Permission denied / no device / target file missing.
 *
 * Recognition lifecycle:
 *  onTargetFound fires → detectedTarget set → medicine looked up → overlay shown.
 *  Duplicate detections for the same index are suppressed.
 *
 * HTTPS note:
 *  Camera access via getUserMedia requires a secure context (HTTPS) in production.
 *  Run `npm run dev` locally — Vite serves on http://localhost which browsers treat as
 *  a "secure context" for camera permission purposes.
 *  On a physical phone, use `npm run dev -- --host` and access via your machine's local
 *  IP over HTTP, OR deploy to any HTTPS host (Netlify, Vercel, GitHub Pages, etc.).
 */
export const Scanner: React.FC = () => {
  const TARGET_SRC = '/targets/targets.mind';

  const { status, errorMessage, detectedTarget, containerRef, startAR, stopAR } =
    useMindAR(TARGET_SRC);

  const [matchedMedicine, setMatchedMedicine] = useState<Medicine | null>(null);
  const [dismissedIndex, setDismissedIndex] = useState<number | null>(null);
  const [manualQuery, setManualQuery] = useState('');
  const [showManual, setShowManual] = useState(false);

  // Resolve detected target to a medicine record
  useEffect(() => {
    if (!detectedTarget) return;
    if (detectedTarget.targetIndex === dismissedIndex) return;

    if (detectedTarget.medicineId) {
      const found = medicines.find((m) => m.id === detectedTarget.medicineId);
      setMatchedMedicine(found ?? null);
    } else {
      setMatchedMedicine(null);
    }
  }, [detectedTarget, dismissedIndex]);

  // Clean up AR on unmount
  useEffect(() => {
    return () => {
      stopAR();
    };
  }, [stopAR]);

  const handleDismissOverlay = () => {
    if (detectedTarget) {
      setDismissedIndex(detectedTarget.targetIndex);
    }
    setMatchedMedicine(null);
  };

  const handleStop = () => {
    stopAR();
    setMatchedMedicine(null);
    setDismissedIndex(null);
  };

  const isActive = status === 'running';
  const isLoading = status === 'loading';
  const hasError = status === 'error';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Medicine Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Aim camera at registered medicine packaging to identify it
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <Button variant="danger" size="md" onClick={handleStop} className="flex items-center gap-1.5">
              <CameraOff className="w-4 h-4" />
              Stop Scan
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={startAR}
              disabled={isLoading}
              className="flex items-center gap-1.5"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
              {isLoading ? 'Starting AR…' : 'Start Scan'}
            </Button>
          )}
        </div>
      </div>

      {/* ── MindAR Container ────────────────────────────────────────── */}
      {/*
        MindAR injects its own <video> and <canvas> into this container.
        We set position:relative and a fixed aspect ratio so the AR scene
        fills the box. Never render React children inside this div while
        MindAR is running — only the overlay positioned on top of it.
      */}
      <div
        data-camera-viewport="true"
        className="camera-container relative w-full overflow-hidden rounded-3xl border-4 border-slate-800 shadow-2xl bg-slate-950 aspect-[3/4] sm:aspect-video min-h-[380px] sm:min-h-[440px] max-h-[72vh]"
      >

        {/* MindAR mounts its video/canvas here */}
        <div
          ref={containerRef}
          data-camera-viewport="true"
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ display: (isActive || isLoading) ? 'block' : 'none' }}
        />

        {/* ── Idle State ─────────────────────────────────── */}
        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Camera className="w-8 h-8 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Camera Inactive</h2>
              <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                Click <strong>Start Scan</strong> to activate the AR engine and begin
                scanning registered medicine packaging.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={startAR}>
              <Camera className="w-4 h-4" />
              Activate AR Scanner
            </Button>
          </div>
        )}

        {/* ── Loading State ──────────────────────────────── */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-3 z-20 pointer-events-none">
            <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
            <p className="text-sm font-semibold">Loading AR Engine…</p>
            <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
              Initialising MindAR target tracker and requesting camera permission.
              Please allow camera access when prompted.
            </p>
          </div>
        )}

        {/* ── Error State ────────────────────────────────── */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-red-900/60 border border-red-500 flex items-center justify-center">
              <XCircle className="w-7 h-7 text-red-400" />
            </div>
            <h2 className="text-base font-bold text-red-200">AR Scanner Error</h2>
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">{errorMessage}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={startAR}>
                Retry
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowManual(true)}
              >
                Manual Search
              </Button>
            </div>
          </div>
        )}

        {/* ── Stopped State ─────────────────────────────── */}
        {status === 'stopped' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <CameraOff className="w-7 h-7 text-slate-400" />
            </div>
            <h2 className="text-base font-bold text-slate-200">Scanner Stopped</h2>
            <p className="text-xs text-slate-400">Camera resources have been released.</p>
            <Button variant="primary" size="sm" onClick={startAR}>
              <Camera className="w-4 h-4" />
              Restart Scanner
            </Button>
          </div>
        )}

        {/* ── Running: Scanning Reticle (no target yet) ── */}
        {isActive && !matchedMedicine && (
          <div className="absolute inset-0 flex flex-col items-center justify-between p-4 sm:p-8 pointer-events-none z-10">
            <div className="w-full flex justify-between">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-t-4 border-l-4 border-teal-400 rounded-tl-xl" />
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-t-4 border-r-4 border-teal-400 rounded-tr-xl" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-teal-300/60 flex items-center justify-center">
                <Scan className="w-6 h-6 sm:w-7 sm:h-7 text-teal-300/80" />
              </div>
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] sm:text-[11px] font-semibold text-white text-center">
                Align medicine packaging inside frame
              </span>
            </div>
            <div className="w-full flex justify-between">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-b-4 border-l-4 border-teal-400 rounded-bl-xl" />
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-b-4 border-r-4 border-teal-400 rounded-br-xl" />
            </div>
          </div>
        )}

        {/* ── Running: Detected — Unknown Target ─────── */}
        {isActive && detectedTarget && !detectedTarget.medicineId && (
          <div className="absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-20 flex justify-center pointer-events-auto">
            <div className="bg-black/80 backdrop-blur-md rounded-xl p-3 sm:px-4 sm:py-3 flex items-center gap-3 text-xs text-white max-w-sm">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-amber-300">Unregistered target detected</p>
                <p className="text-slate-300 text-[11px]">
                  This packaging is not in the MIARIS target registry. Use manual search below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Running: Detected — Known Medicine Overlay ─ */}
        {isActive && matchedMedicine && (
          <div className="absolute bottom-2 sm:bottom-4 left-2 right-2 sm:left-4 sm:right-4 z-30 flex justify-center pointer-events-auto max-h-[85%] overflow-y-auto">
            <AROverlayCard
              medicine={matchedMedicine}
              onDismiss={handleDismissOverlay}
            />
          </div>
        )}

        {/* Status bar (hidden when card is showing to prevent collision) */}
        {isActive && !matchedMedicine && (!detectedTarget || Boolean(detectedTarget.medicineId)) && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-300 pointer-events-none z-10">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono capitalize">MindAR Tracking</span>
            </div>
            <span className="bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg font-mono hidden sm:inline-block">
              Image Targets: /targets/targets.mind
            </span>
          </div>
        )}
      </div>

      {/* ── Scanning Tips ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200">
          <div className="text-xs font-bold text-slate-900 mb-1">1. Good Lighting</div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ensure the medicine box is well-lit and avoid harsh glare on the packaging surface.
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200">
          <div className="text-xs font-bold text-slate-900 mb-1">2. Steady & Close</div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hold 15–25 cm away, parallel to the front label. Keep the device steady for tracking lock.
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200">
          <div className="text-xs font-bold text-slate-900 mb-1">3. Registered Targets Only</div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Only packaging compiled into <code className="bg-slate-100 px-1 rounded text-[10px]">targets.mind</code> will be recognised. See TARGETS_GUIDE.md.
          </p>
        </div>
      </div>

      {/* ── Manual Medicine Search Fallback ──────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <button
          className="w-full flex items-center justify-between text-left"
          onClick={() => setShowManual((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#2563EB]" />
            <div>
              <div className="text-sm font-bold text-slate-900">Manual Medicine Search</div>
              <div className="text-xs text-slate-500">
                Can't use camera or packaging damaged? Look up by name.
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#2563EB]">
            {showManual ? 'Hide ▲' : 'Show ▼'}
          </span>
        </button>

        {showManual && (
          <ARManualSearch query={manualQuery} onChange={setManualQuery} />
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>Need to browse all medicines?</span>
          <Link
            to="/library"
            className="font-bold text-[#2563EB] hover:underline flex items-center gap-1"
          >
            Open Medicine Library <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ── HTTPS & Testing Notice ────────────────────────────────── */}
      <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 space-y-1 leading-relaxed">
          <p>
            <strong>Camera & HTTPS:</strong> Camera permission requires a secure context.
            <code className="bg-blue-100 px-1 rounded mx-1 font-mono text-[11px]">localhost</code>
            is automatically trusted. For testing on a phone over LAN, run{' '}
            <code className="bg-blue-100 px-1 rounded font-mono text-[11px]">npm run dev -- --host</code>
            {' '}and open the network IP on your device, or deploy to HTTPS.
          </p>
          <p>
            <strong>Target file:</strong> Compile your images first using the MindAR Image Target
            Compiler (see <code className="bg-blue-100 px-1 rounded font-mono text-[11px]">TARGETS_GUIDE.md</code>)
            then place the output at{' '}
            <code className="bg-blue-100 px-1 rounded font-mono text-[11px]">public/targets/targets.mind</code>.
          </p>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          <strong>Safety Notice:</strong> MIARIS image recognition identifies a registered
          package photograph. It does not verify the medicine's authenticity, contents,
          expiry date, or safety. Always read the physical packaging label and consult a
          licensed pharmacist or physician before administering any medication.
        </p>
      </div>
    </div>
  );
};
