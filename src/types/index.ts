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
}

export interface ExportSettings {
  aspectRatio: '4:3' | '3:4' | '1:1' | '16:9';
  shadows: boolean;
}