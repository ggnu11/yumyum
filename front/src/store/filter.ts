import {MARKER_CATEGORIES} from '@/constants/markerIcons';
import {create} from 'zustand';

interface FilterState {
  filters: Record<string, boolean>;
  setFilters: (filters: Record<string, boolean>) => void;
}

const initialFilters: Record<string, boolean> = {
  ...Object.fromEntries(MARKER_CATEGORIES.map(({key}) => [key, true])),
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
};

const useFilterStore = create<FilterState>(set => ({
  filters: initialFilters,
  setFilters: filters => {
    set({filters});
  },
}));

export default useFilterStore;
