import {create} from 'zustand';

interface BottomSheetState {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

const useBottomSheetStore = create<BottomSheetState>(set => ({
  isVisible: false,
  setIsVisible: (isVisible: boolean) => {
    set({isVisible});
  },
}));

export default useBottomSheetStore;
