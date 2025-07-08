import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { labelAPI } from "@/api/label.api";
import { Label } from "@/types/label";

export const useLabelSearch = () => {
  const [searchResults, setSearchResults] = useState<Label[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchLabels = useCallback(
    debounce(async (query: string) => {
      if (!query || query.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await labelAPI.searchLabels(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  const triggerSearch = useCallback((searchQuery: string) => {
    if (searchQuery.trim().length >= 2) {
      searchLabels(searchQuery);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchLabels]);

  return {
    searchResults,
    isSearching,
    triggerSearch,
  };
};