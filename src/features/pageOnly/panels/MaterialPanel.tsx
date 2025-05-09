import React, { useState, useRef } from 'react';
import { Globe, X, Upload } from 'lucide-react';

import { ModelSettings } from '../../../types';

import { PanelBase } from '../../buildingBlocks/PanelBase';
import { Slider } from '../../buildingBlocks/Slider';
import { ButtonSimpleIcon } from '../../buildingBlocks/ButtonSimpleIcon';
import { ButtonGrey, ButtonOutline } from '../../buildingBlocks/Button';
import { usePanelManager } from '../contexts/PanelManagerContext';
import { useEditHistory } from '../contexts/EditHistoryContext';
import { useRotation } from '../contexts/RotationContext';
import { useCamera } from '../contexts/CameraContext';

interface MaterialPanelProps {
  modelSettings: ModelSettings;
  onModelSettingsChange: (settings: ModelSettings) => void;
}

type TextureInputMode = 'upload' | 'url';

type TabsType = ModelSettings["panelTabs"];
const tabs: TabsType[] = ['general', 'texture'];

export const MaterialPanel: React.FC<MaterialPanelProps> = ({
  modelSettings,
  onModelSettingsChange,
}) => {
  const { panelStates, closePanel } = usePanelManager();
  const { isOpen, zIndex } = panelStates.material;
  const { rotation } = useRotation();
  const { zoom, orbitX, orbitY } = useCamera();
  const { addToHistory } = useEditHistory();
  const [activeTab, setActiveTab] = useState<TabsType>('general');
  const [textureMode, setTextureMode] = useState<TextureInputMode>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasTexture = modelSettings.texture.url !== '';

  if (!isOpen) return null;

  const handleSettingChange = (key: keyof ModelSettings, value: any) => {
    const newSettings = {
      ...modelSettings,
      [key]: value
    };

    onModelSettingsChange(newSettings);

    addToHistory({
      modelSettings: newSettings,
      rotation,
      zoom,
      orbitX,
      orbitY
    });
  };

  const handleTextureChange = (key: keyof ModelSettings['texture'], value: any) => {
    const newSettings = {
      ...modelSettings,
      texture: {
        ...modelSettings.texture,
        [key]: value,
        enabled: value !== ''
      }
    };

    onModelSettingsChange(newSettings);

    addToHistory({
      modelSettings: newSettings,
      rotation,
      zoom,
      orbitX,
      orbitY
    });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      handleTextureChange('url', url);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      handleTextureChange('url', url);
    }
  };

  const handleDiscardTexture = () => {
    handleTextureChange('url', '');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <PanelBase
      title='Material Settings'
      panelId="material"
      zIndex={zIndex}
      onClose={() => closePanel("material")}
      onTabChange={setActiveTab}
      {...{ tabs, activeTab }}
    >
      {activeTab === 'general' ? (
        <>
          <div className="space-y-2">
            <label className={`block text-sm ${modelSettings.wireframe ? 'line-through text-white/30' : 'text-white/60'}`}>
              Color
            </label>
            <input
              type="color"
              value={modelSettings.color}
              onChange={(e) => handleSettingChange('color', e.target.value)}
              className={`w-full h-8 bg-transparent cursor-pointer ${modelSettings.wireframe ? 'opacity-30' : ''}`}
              disabled={modelSettings.wireframe}
            />
          </div>

          <Slider
            value={modelSettings.roughness}
            onChange={(value) => handleSettingChange('roughness', value)}
            min={0}
            max={1}
            step={0.1}
            minLabel="Smooth"
            maxLabel="Rough"
            label="Roughness"
            disabled={modelSettings.wireframe}
          />

          <Slider
            value={modelSettings.metalness}
            onChange={(value) => handleSettingChange('metalness', value)}
            min={0}
            max={1}
            step={0.1}
            minLabel="Non-metallic"
            maxLabel="Metallic"
            label="Metalness"
            disabled={modelSettings.wireframe}
          />
        </>
      ) : (
        <div className="space-y-4">
          {textureMode === 'upload' ? (
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-300
                ${hasTexture ? 'border-white/20' : 'border-white/40'}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
              {hasTexture ? (
                <div className="space-y-2">
                  <img
                    src={modelSettings.texture.url}
                    alt="Current texture"
                    className="max-h-32 mx-auto object-contain rounded"
                  />
                  <ButtonSimpleIcon
                    icon={X}
                    onClick={handleDiscardTexture}
                    title='Discard texture'
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-white/60">Drop a texture here or</p>

                  <ButtonGrey
                    fullWidth
                    label="Upload texture"
                    icon={Upload}
                    onClick={() => fileInputRef.current?.click()}
                  />

                  <ButtonOutline
                    fullWidth
                    icon={Globe}
                    label='Use URL instead'
                    onClick={() => setTextureMode('url')}
                    title="Select image from the web"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm text-white/60">Texture URL</label>
                <ButtonSimpleIcon
                  icon={X}
                  onClick={() => {
                    handleTextureChange('url', '');
                    setTextureMode('upload');
                  }}
                  title="Clear URL and switch to upload"
                />
              </div>
              <input
                type="text"
                value={modelSettings.texture.url}
                onChange={(e) => handleTextureChange('url', e.target.value)}
                placeholder="Enter texture URL"
                className="w-full bg-black border border-white/20 p-2 text-white focus:outline-none focus:border-white"
              />
            </div>
          )}

          <Slider
            value={modelSettings.texture.scale}
            onChange={(value) => handleTextureChange('scale', value)}
            min={0.1}
            max={10}
            step={0.1}
            minLabel="0.1x"
            maxLabel="10x"
            label="Scale"
            disabled={!hasTexture}
          />

          <div className="space-y-4">
            <label className='block text-sm text-white/60'>
              Repeat
            </label>

            <Slider
              value={modelSettings.texture.repeat.x}
              onChange={(value) => handleTextureChange('repeat', { ...modelSettings.texture.repeat, x: value })}
              min={1}
              max={10}
              step={1}
              minLabel="1x"
              maxLabel="10x"
              label="X Repeat"
              disabled={!hasTexture}
            />
            <Slider
              value={modelSettings.texture.repeat.y}
              onChange={(value) => handleTextureChange('repeat', { ...modelSettings.texture.repeat, y: value })}
              min={1}
              max={10}
              step={1}
              minLabel="1x"
              maxLabel="10x"
              label="Y Repeat"
              disabled={!hasTexture}
            />
          </div>

          <div className="space-y-4">
            <label className='block text-sm text-white/60'>
              Offset
            </label>

            <Slider
              value={modelSettings.texture.offset.x}
              onChange={(value) => handleTextureChange('offset', { ...modelSettings.texture.offset, x: value })}
              min={-1}
              max={1}
              step={0.1}
              minLabel="-1"
              maxLabel="1"
              label="X Offset"
              disabled={!hasTexture}
            />
            <Slider
              value={modelSettings.texture.offset.y}
              onChange={(value) => handleTextureChange('offset', { ...modelSettings.texture.offset, y: value })}
              min={-1}
              max={1}
              step={0.1}
              minLabel="-1"
              maxLabel="1"
              label="Y Offset"
              disabled={!hasTexture}
            />
          </div>
        </div>
      )}
    </PanelBase>
  );
};