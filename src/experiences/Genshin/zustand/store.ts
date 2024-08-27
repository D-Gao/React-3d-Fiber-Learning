// store.ts
import { create } from "zustand";

// Define the shape of the state
interface StoreState {
  bgmStarted: boolean;
  doorCreated: boolean;
  count: number;
  isRunning: boolean;
  increment: () => void;
  reset: () => void;
  startBgm: () => void;
  toggleDoor: () => void;
  setRunning: (e: boolean) => void;
}

// Create the Zustand store with types
const useStore = create<StoreState>((set) => ({
  bgmStarted: false,
  doorCreated: false,
  count: 0,
  isRunning: true,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
  startBgm: () => set((state) => ({ bgmStarted: true })),
  toggleDoor: () => set((state) => ({ doorCreated: !state.doorCreated })),
  setRunning: (e: boolean) => set((state) => ({ isRunning: e })),
}));

export default useStore;
