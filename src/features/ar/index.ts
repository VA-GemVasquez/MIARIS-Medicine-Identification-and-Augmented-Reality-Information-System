// AR Display feature: core interfaces and exports
export * from './targetMappings';

export interface AROverlayConfig {
  targetIndex: number;
  medicineId: string | null;
  trackingState: 'idle' | 'searching' | 'tracking' | 'lost';
}
