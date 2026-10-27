declare module 'mind-ar/dist/mindar-image-three.prod.js' {
  import * as THREE from 'three';

  export interface MindARThreeOptions {
    container: HTMLElement;
    imageTargetSrc: string;
    maxTrack?: number;
    uiLoading?: string;
    uiScanning?: string;
    uiError?: string;
    filterMinCF?: number;
    filterBeta?: number;
    warmupTolerance?: number;
    missTolerance?: number;
  }

  export interface MindARAnchor {
    group: THREE.Group;
    targetIndex: number;
    onTargetFound: (() => void) | null;
    onTargetLost: (() => void) | null;
    visible: boolean;
  }

  export class MindARThree {
    constructor(options: MindARThreeOptions);
    container: HTMLElement;
    imageTargetSrc: string;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    video: HTMLVideoElement;
    anchors: MindARAnchor[];
    addAnchor(targetIndex: number): MindARAnchor;
    start(): Promise<void>;
    stop(): void;
    switchCamera(): void;
  }
}

