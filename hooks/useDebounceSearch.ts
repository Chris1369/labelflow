import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

interface UseDebounceSearchOptions {
  delay?: number;
  minLength?: number;
}

export function useDebounceSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  options: UseDebounceSearchOptions = {}
) {
  const { delay = 300, minLength = 2 } = options;
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery || searchQuery.trim().length < minLength) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setError(null);
      
      try {
        const searchResults = await searchFunction(searchQuery);
        setResults(searchResults);
      } catch (err) {
        console.error('Search error:', err);
        setError(err as Error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, delay),
    [searchFunction, delay, minLength]
  );

  // Trigger search when query changes
  useEffect(() => {
    if (query.trim().length >= minLength) {
      debouncedSearch(query);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [query, debouncedSearch, minLength]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    clearSearch: () => {
      setQuery('');
      setResults([]);
      setError(null);
    }
  };
}