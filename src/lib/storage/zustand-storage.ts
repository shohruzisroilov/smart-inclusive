import type { StateStorage } from "zustand/middleware";
import { getStorage } from "./safe-storage";

/**
 * Zustand `persist` middleware'i uchun adapter.
 *
 * Store'lar to'g'ridan-to'g'ri `localStorage`ga emas, shu yerga yozadi —
 * shunda SSR xavfsizligi, Safari private mode va kvota xatolari bitta
 * joyda hal qilinadi.
 */
export const zustandStorage: StateStorage = {
  getItem: (name) => getStorage().getItem(name),
  setItem: (name, value) => {
    getStorage().setItem(name, value);
  },
  removeItem: (name) => {
    getStorage().removeItem(name);
  },
};
