// store.ts
import { create } from "zustand";

// Define the shape of the state
interface StoreState {
  bgmStarted: boolean;
  count: number;
  increment: () => void;
  reset: () => void;
  startBgm: () => void;
}

// Create the Zustand store with types
const useStore = create<StoreState>((set) => ({
  bgmStarted: false,
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
  startBgm: () => set((state) => ({ bgmStarted: true })),
}));

export default useStore;
