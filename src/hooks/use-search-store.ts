import { create } from "zustand";

type RecentSearch = {
  term: string;
  timestamp: number;
};

interface SearchStore {
  isOpen: boolean;
  recentSearches: RecentSearch[];
  searchTerm: string;
  setIsOpen: (isOpen: boolean) => void;
  setSearchTerm: (term: string) => void;
  addRecentSearch: (term: string) => void;
  clearHistory: () => void;
  loadRecentSearches: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,
  recentSearches: [],
  searchTerm: "",
  setIsOpen: (isOpen) => set({ isOpen }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  addRecentSearch: (term) =>
    set((state) => {
      const newSearch = { term, timestamp: Date.now() };
      const updatedSearches = [
        newSearch,
        ...state.recentSearches.filter((s) => s.term !== term),
      ].slice(0, 5);

      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      return { recentSearches: updatedSearches };
    }),
  clearHistory: () => {
    localStorage.removeItem("recentSearches");
    set({ recentSearches: [] });
  },
  loadRecentSearches: () => {
    const searches = localStorage.getItem("recentSearches");
    if (searches) {
      set({ recentSearches: JSON.parse(searches) });
    }
  },
}));
