import { useState, useEffect } from 'react';

export interface Preset {
  id: string;
  name: string;
  names: string;
  createdAt: number;
}

const STORAGE_KEY = 'team-randomizer-presets';

export const usePresets = () => {
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPresets(JSON.parse(saved));
      } catch {
        setPresets([]);
      }
    }
  }, []);

  const savePresets = (newPresets: Preset[]) => {
    setPresets(newPresets);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPresets));
  };

  const addPreset = (name: string, names: string) => {
    const newPreset: Preset = {
      id: Date.now().toString(),
      name,
      names,
      createdAt: Date.now(),
    };
    savePresets([...presets, newPreset]);
    return newPreset;
  };

  const deletePreset = (id: string) => {
    savePresets(presets.filter((p) => p.id !== id));
  };

  return { presets, addPreset, deletePreset };
};
