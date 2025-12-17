import {create} from 'zustand';

interface SearchStore {
  recentSearches: string[];
  addRecentSearch: (keyword: string) => void;
  clearRecentSearches: () => void;
}

const useSearchStore = create<SearchStore>(set => ({
  recentSearches: [],
  addRecentSearch: keyword =>
    set(state => ({
      recentSearches: [
        keyword,
        ...state.recentSearches.filter(item => item !== keyword),
      ].slice(0, 20), // 최근 20개만 유지
    })),
  clearRecentSearches: () => set({recentSearches: []}),
}));

export default useSearchStore;
