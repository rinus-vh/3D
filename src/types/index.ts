export interface AxisRotation {
  speed: number;
  fixed: number;
}

export interface RotationSettings {
  x: AxisRotation;
  y: AxisRotation;
  z: AxisRotation;
}

export interface ModelSettings {
  panelTabs: 'general' | 'texture';
  wireframe: boolean;
  wireframeColor: string;
  color: string;
  roughness: number;
  metalness: number;
  resolution: number;
  lighting: boolean;
  shadows: boolean;
  lightColor: string;
  lightStrength: number;
  gravity: boolean;
  texture: {
    enabled: boolean;
    url: string;
    scale: number;
    repeat: { x: number; y: number };
    offset: { x: number; y: number };
  };
}

export interface ExportSettings {
  aspectRatio: '4:3' | '3:4' | '1:1' | '16:9';
  shadows: boolean;
}