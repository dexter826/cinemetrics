import { create } from 'zustand';

interface InitialLoadStore {
  isInitialLoadComplete: boolean;
  markInitialLoadComplete: () => void;
}

const useInitialLoadStore = create<InitialLoadStore>((set) => ({
  isInitialLoadComplete: false,
  markInitialLoadComplete: () => set({ isInitialLoadComplete: true }),
}));

export default useInitialLoadStore;
