import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COLOR_PALETTES } from '../lib/constants';
import { ThemePaletteName } from '../types';

interface ThemeState {
  currentPalette: ThemePaletteName;
  setThemeColor: (name: ThemePaletteName) => void;
  applyThemeToDOM: (name?: ThemePaletteName) => void;
}

export const applyCssVariables = (paletteName: ThemePaletteName) => {
  const palette = COLOR_PALETTES.find((p) => p.name === paletteName) || COLOR_PALETTES[0];
  const root = document.documentElement;

  root.style.setProperty('--primary', palette.rgb);
  root.style.setProperty('--primary-hover', palette.hover);
  root.style.setProperty('--primary-light', palette.light);
  root.style.setProperty('--primary-foreground', '255 255 255');
  root.style.setProperty('--primary-rgb', palette.rgb.replace(/ /g, ', '));
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentPalette: 'indigo',
      setThemeColor: (name: ThemePaletteName) => {
        applyCssVariables(name);
        set({ currentPalette: name });
      },
      applyThemeToDOM: (name?: ThemePaletteName) => {
        const target = name || get().currentPalette;
        applyCssVariables(target);
      },
    }),
    {
      name: 'unitimely_admin_theme',
      onRehydrateStorage: () => (state) => {
        if (state?.currentPalette) {
          applyCssVariables(state.currentPalette);
        }
      },
    }
  )
);
