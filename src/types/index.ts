export interface AxisRotation {
  speed: number;
  fixed: number;
}

export interface RotationSettings {
  x: AxisRotation;
  y: AxisRotation;
  z: AxisRotation;
}

export interface TextureSettings {
  enabled: boolean;
  url: string;
  scale: number;
  repeat: { x: number; y: number };
  offset: { x: number; y: number };
}

export interface BumpMapSettings {
  enabled: boolean;
  url: string;
  strength: number;
}

export interface ModelSettings {
  panelTabs: 'general' | 'texture' | 'bumpMap';
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
  texture: TextureSettings;
  bumpMap: BumpMapSettings;
}

export interface AdvancedSettings {
  backgroundColor: string;
  showGroundPlane: boolean;
  gravity: boolean;
}

export interface ExportSettings {
  aspectRatio: '4:3' | '3:4' | '1:1' | '16:9';
  shadows: boolean;
}