"use client";

import { getSearchSuggestions } from "@/actions/search";
import Highlight from "@/components/ui/other/Highlight";
import { useSearchModal } from "@/hooks/useSearchModal";
import { SEARCH_HISTORY_STORAGE_KEY } from "@/utils/constants";
import { cn, isEmpty } from "@/utils/helpers";
import { ArrowUpLeft, Close, History, Movie, Robot, Search, TV } from "@/utils/icons";
import { useRouter } from "@bprogress/next/app";
import {
  Button,
  Kbd,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
} from "@heroui/react";
import { useDebouncedValue, useLocalStorage } from "@mantine/hooks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const FloatingSearch: React.FC = () => {
  const { isOpen, close: onClose } = useSearchModal();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);
  const [searchHistories, setSearchHistories] = useLocalStorage<string[]>({
    key: SEARCH_HISTORY_STORAGE_KEY,
    defaultValue: [],
  });

  const enableFetch = debouncedSearchQuery.length > 2;
  const { data, isFetching } = useQuery({
    enabled: enableFetch,
    queryKey: ["search-suggestions-unified", debouncedSearchQuery],
    queryFn: async () => await getSearchSuggestions(debouncedSearchQuery, 12),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const showSuggestions = enableFetch && !isFetching && !isEmpty(data?.data);
  const showHistory = !enableFetch && !isEmpty(searchHistories);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isEmpty(searchQuery.trim())) return;

      if (searchQuery && !searchHistories.includes(searchQuery.trim())) {
        const newHistories = [...searchHistories, searchQuery.trim()];
        if (newHistories.length > 8) newHistories.shift();
        setSearchHistories(newHistories);
      }

      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    },
    [searchQuery, searchHistories, router, onClose, setSearchHistories],
  );

  const handleSuggestionSelect = useCallback(
    (id: number, type: "movie" | "tv" | "anime") => {
      router.push(`/${type}/${id}`);
      onClose();
    },
    [router, onClose],
  );

  const handleHistorySelect = useCallback(
    (history: string) => {
      setSearchQuery(history);
      router.push(`/search?q=${encodeURIComponent(history)}`);
      onClose();
    },
    [router, onClose],
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
    inputRef.current?.focus();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="top"
      size="2xl"
      backdrop="blur"
      hideCloseButton
      classNames={{
        base: "mt-16 md:mt-24 mx-3",
        backdrop: "bg-black/60",
        body: "p-0",
        wrapper: "items-start",
      }}
      motionProps={{
        variants: {
          enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: "easeOut" } },
          exit: { opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.2, ease: "easeIn" } },
        },
      }}
    >
      <ModalContent>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <Search className="text-default-400 shrink-0 text-lg" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, TV shows, and anime..."
                className="placeholder:text-default-400 min-w-0 flex-1 bg-transparent text-base outline-none"
                autoComplete="off"
              />
              <div className="flex items-center gap-2">
                {isFetching && <Spinner size="sm" color="default" />}
                {!isEmpty(searchQuery) && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-default-400"
                    onPress={handleClear}
                    type="button"
                  >
                    <Close size={18} />
                  </Button>
                )}
                <Kbd className="hidden text-xs md:inline-flex">ESC</Kbd>
              </div>
            </div>
          </form>

          {/* Results / History */}
          <div className="max-h-[60vh] overflow-y-auto pb-2">
            <AnimatePresence mode="wait">
              {showSuggestions && (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="text-default-400 px-4 py-2 text-xs font-semibold tracking-wider uppercase">
                    Results for &quot;{debouncedSearchQuery}&quot;
                  </p>
                  <Listbox
                    aria-label="Search Results"
                    variant="flat"
                    classNames={{ list: "gap-0" }}
                  >
                    <>
                      {(data?.data || []).map(({ id, title, type }) => (
                        <ListboxItem
                          key={`${type}-${id}`}
                          className="rounded-none px-4 py-2.5"
                          startContent={
                            type === "movie" ? (
                              <Movie className="text-primary shrink-0" />
                            ) : type === "anime" ? (
                              <Robot className="text-secondary shrink-0" />
                            ) : (
                              <TV className="text-warning shrink-0" />
                            )
                          }
                          endContent={
                            <div className="flex items-center gap-1">
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                                  type === "movie"
                                    ? "bg-primary/20 text-primary"
                                    : type === "anime"
                                      ? "bg-secondary/20 text-secondary"
                                      : "bg-warning/20 text-warning",
                                )}
                              >
                                {type === "movie" ? "Movie" : type === "anime" ? "Anime" : "TV"}
                              </span>
                              <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                className="text-default-400 size-6"
                                onPress={() => setSearchQuery(title)}
                                type="button"
                              >
                                <ArrowUpLeft size={16} />
                              </Button>
                            </div>
                          }
                          onPress={() => handleSuggestionSelect(id, type)}
                        >
                          <Highlight markType="bold" highlight={debouncedSearchQuery}>
                            {title}
                          </Highlight>
                        </ListboxItem>
                      ))}
                    </>
                  </Listbox>
                  {/* Search all results link */}
                  <button
                    onClick={handleSubmit}
                    className="hover:bg-default-100 flex w-full items-center justify-between border-t border-white/10 px-4 py-3 text-sm transition-colors"
                    type="button"
                  >
                    <span className="text-default-600">
                      See all results for{" "}
                      <span className="text-foreground font-semibold">
                        &quot;{searchQuery}&quot;
                      </span>
                    </span>
                    <Search className="text-default-400 text-sm" />
                  </button>
                </motion.div>
              )}

              {showHistory && !showSuggestions && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="text-default-400 px-4 py-2 text-xs font-semibold tracking-wider uppercase">
                    Recent Searches
                  </p>
                  <Listbox
                    aria-label="Search History"
                    variant="flat"
                    classNames={{ list: "gap-0" }}
                  >
                    <>
                      {[...searchHistories].reverse().map((history) => (
                        <ListboxItem
                          key={history}
                          className="rounded-none px-4 py-2.5"
                          startContent={<History className="text-default-400 shrink-0" />}
                          endContent={
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              className="text-default-400 size-6"
                              onPress={() =>
                                setSearchHistories(searchHistories.filter((h) => h !== history))
                              }
                              type="button"
                            >
                              <Close size={16} />
                            </Button>
                          }
                          onPress={() => handleHistorySelect(history)}
                        >
                          {history}
                        </ListboxItem>
                      ))}
                    </>
                  </Listbox>
                </motion.div>
              )}

              {!showSuggestions && !showHistory && isEmpty(searchQuery) && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 py-12 text-center"
                >
                  <Search className="text-default-300 text-4xl" />
                  <p className="text-default-500 text-sm">
                    Search for your favorite movies, TV shows, and anime
                  </p>
                </motion.div>
              )}

              {enableFetch && !isFetching && isEmpty(data?.data) && (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 py-12 text-center"
                >
                  <p className="text-default-500 text-sm">
                    No results found for{" "}
                    <span className="text-foreground font-semibold">
                      &quot;{debouncedSearchQuery}&quot;
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FloatingSearch;
