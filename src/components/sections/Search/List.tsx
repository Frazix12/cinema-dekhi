"use client";

import { tmdb } from "@/api/tmdb";
import { jikan, PaginationInfo } from "@/api/jikan";
import { queryClient } from "@/app/providers";
import AnimePosterCard from "@/components/sections/Anime/Cards/Poster";
import TvShowHomeCard from "@/components/sections/TV/Cards/Poster";
import BackToTopButton from "@/components/ui/button/BackToTopButton";
import { useSearchModal } from "@/hooks/useSearchModal";
import { isEmpty } from "@/utils/helpers";
import { getLoadingLabel } from "@/utils/movies";
import { Movie as MovieIcon, Robot, Search, TV as TVIcon } from "@/utils/icons";
import { Button, Chip, Spinner } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { Movie, TV } from "tmdb-ts/dist/types";
import MoviePosterCard from "../Movie/Cards/Poster";
import { parseAsString, useQueryState } from "nuqs";
import type { AnimeData } from "../Anime/AnimeList";

const fetchMovies = (query: string, page: number) => tmdb.search.movies({ query, page });

const fetchTVShows = (query: string, page: number) => tmdb.search.tvShows({ query, page });

const fetchAnime = (query: string, page: number) => jikan.searchAnime(query, page);

interface AnimeSearchResponse {
  data: AnimeData[];
  pagination: PaginationInfo;
}

const SearchList = () => {
  const { open: openSearch } = useSearchModal();
  const { ref, inViewport } = useInViewport();

  // Read the search query from URL ?q=...
  const [searchQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [activeType, setActiveType] = useQueryState("type", parseAsString.withDefault("all"));

  const triggered = !isEmpty(searchQuery.trim());

  const {
    data: movieData,
    isFetching: isFetchingMovies,
    isPending: isPendingMovies,
    fetchNextPage: fetchNextMovies,
    isFetchingNextPage: isFetchingNextMovies,
    hasNextPage: hasNextMovies,
  } = useInfiniteQuery({
    enabled: triggered && (activeType === "all" || activeType === "movie"),
    queryKey: ["search-movies", searchQuery],
    queryFn: ({ pageParam: page }) => fetchMovies(searchQuery, page as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  const {
    data: tvData,
    isFetching: isFetchingTV,
    isPending: isPendingTV,
    fetchNextPage: fetchNextTV,
    isFetchingNextPage: isFetchingNextTV,
    hasNextPage: hasNextTV,
  } = useInfiniteQuery({
    enabled: triggered && (activeType === "all" || activeType === "tv"),
    queryKey: ["search-tv", searchQuery],
    queryFn: ({ pageParam: page }) => fetchTVShows(searchQuery, page as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  const {
    data: animeData,
    isFetching: isFetchingAnime,
    isPending: isPendingAnime,
    fetchNextPage: fetchNextAnime,
    isFetchingNextPage: isFetchingNextAnime,
    hasNextPage: hasNextAnime,
  } = useInfiniteQuery<AnimeSearchResponse>({
    enabled: triggered && (activeType === "all" || activeType === "anime"),
    queryKey: ["search-anime", searchQuery],
    queryFn: ({ pageParam: page }) => fetchAnime(searchQuery, page as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next_page ? lastPage.pagination.current_page + 1 : undefined,
  });

  useEffect(() => {
    if (inViewport) {
      if (activeType === "movie" || activeType === "all") fetchNextMovies();
      if (activeType === "tv" || activeType === "all") fetchNextTV();
      if (activeType === "anime" || activeType === "all") fetchNextAnime();
    }
  }, [activeType, fetchNextAnime, fetchNextMovies, fetchNextTV, inViewport]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ["search-movies"] });
      queryClient.removeQueries({ queryKey: ["search-tv"] });
      queryClient.removeQueries({ queryKey: ["search-anime"] });
    };
  }, []);

  const totalMovies = movieData?.pages[0]?.total_results ?? 0;
  const totalTV = tvData?.pages[0]?.total_results ?? 0;
  const totalAnime = animeData?.pages[0]?.pagination.items.total ?? 0;
  const totalResults = totalMovies + totalTV + totalAnime;

  const moviesEmpty = isEmpty(movieData?.pages[0]?.results);
  const tvEmpty = isEmpty(tvData?.pages[0]?.results);
  const animeEmpty = isEmpty(animeData?.pages[0]?.data);

  const isPending =
    (activeType === "all" && (isPendingMovies || isPendingTV || isPendingAnime)) ||
    (activeType === "movie" && isPendingMovies) ||
    (activeType === "tv" && isPendingTV) ||
    (activeType === "anime" && isPendingAnime);

  const isFetchingNext =
    (activeType === "movie" && isFetchingNextMovies) ||
    (activeType === "tv" && isFetchingNextTV) ||
    (activeType === "anime" && isFetchingNextAnime) ||
    (activeType === "all" && (isFetchingNextMovies || isFetchingNextTV || isFetchingNextAnime));

  const hasNext =
    (activeType === "movie" && hasNextMovies) ||
    (activeType === "tv" && hasNextTV) ||
    (activeType === "anime" && hasNextAnime) ||
    (activeType === "all" && (hasNextMovies || hasNextTV || hasNextAnime));

  const typeOptions = [
    { key: "all", label: "All" },
    { key: "movie", label: `Movies${totalMovies ? ` (${totalMovies})` : ""}` },
    { key: "tv", label: `TV Series${totalTV ? ` (${totalTV})` : ""}` },
    { key: "anime", label: `Anime${totalAnime ? ` (${totalAnime})` : ""}` },
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Search bar trigger */}
      <div className="flex w-full flex-col items-center gap-4">
        <button
          onClick={openSearch}
          type="button"
          className="bg-secondary-background hover:bg-default-100 flex w-full max-w-xl cursor-pointer items-center gap-3 rounded-full px-4 py-3 transition-colors"
          aria-label="Open Search"
        >
          <Search className="text-default-400 shrink-0" />
          {triggered ? (
            <span className="min-w-0 flex-1 truncate text-left text-sm">{searchQuery}</span>
          ) : (
            <span className="text-default-400 flex-1 text-left text-sm">
              Search movies, TV shows, and anime...
            </span>
          )}
          <kbd className="bg-default-200 text-default-500 hidden rounded px-1.5 py-0.5 text-xs md:inline-flex">
            CTRL+K
          </kbd>
        </button>

        {/* Type filter tabs — only show when results exist */}
        {triggered && !isPending && (
          <div className="flex items-center gap-2">
            {typeOptions.map((opt) => (
              <Chip
                key={opt.key}
                variant={activeType === opt.key ? "solid" : "flat"}
                color={activeType === opt.key ? "primary" : "default"}
                className="cursor-pointer transition-all"
                onClick={() => setActiveType(opt.key)}
              >
                {opt.label}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {triggered && (
        <>
          <div className="relative flex w-full flex-col items-center gap-8">
            {isPending ? (
              <Spinner size="lg" className="mt-48" color="primary" variant="simple" />
            ) : (
              <>
                {/* Summary */}
                {!moviesEmpty || !tvEmpty || !animeEmpty ? (
                  <h5 className="text-center text-xl">
                    <span className="motion-preset-focus">
                      Found{" "}
                      <span className="text-success font-semibold">
                        {activeType === "movie"
                          ? totalMovies
                          : activeType === "tv"
                            ? totalTV
                            : activeType === "anime"
                              ? totalAnime
                              : totalResults}
                      </span>{" "}
                      results for{" "}
                      <span className="text-warning font-semibold">&quot;{searchQuery}&quot;</span>
                    </span>
                  </h5>
                ) : (
                  <h5 className="mt-56 text-center text-xl">
                    No results found for{" "}
                    <span className="text-warning font-semibold">&quot;{searchQuery}&quot;</span>
                  </h5>
                )}

                {/* Movies section */}
                {(activeType === "all" || activeType === "movie") && !moviesEmpty && (
                  <div className="w-full">
                    {activeType === "all" && (
                      <div className="mb-4 flex items-center gap-2">
                        <MovieIcon className="text-primary" />
                        <h6 className="text-lg font-semibold">Movies</h6>
                        <span className="text-default-400 text-sm">({totalMovies} results)</span>
                      </div>
                    )}
                    <div className="movie-grid">
                      {movieData?.pages.map((page) =>
                        page.results.map((movie) => (
                          <MoviePosterCard
                            key={movie.id}
                            movie={movie as Movie}
                            variant="bordered"
                          />
                        )),
                      )}
                    </div>
                  </div>
                )}

                {/* TV section */}
                {(activeType === "all" || activeType === "tv") && !tvEmpty && (
                  <div className="w-full">
                    {activeType === "all" && (
                      <div className="mb-4 flex items-center gap-2">
                        <TVIcon className="text-warning" />
                        <h6 className="text-lg font-semibold">TV Series</h6>
                        <span className="text-default-400 text-sm">({totalTV} results)</span>
                      </div>
                    )}
                    <div className="movie-grid">
                      {tvData?.pages.map((page) =>
                        page.results.map((tv) => (
                          <TvShowHomeCard key={tv.id} tv={tv as TV} variant="bordered" />
                        )),
                      )}
                    </div>
                  </div>
                )}

                {(activeType === "all" || activeType === "anime") && !animeEmpty && (
                  <div className="w-full">
                    {activeType === "all" && (
                      <div className="mb-4 flex items-center gap-2">
                        <Robot className="text-secondary" />
                        <h6 className="text-lg font-semibold">Anime</h6>
                        <span className="text-default-400 text-sm">({totalAnime} results)</span>
                      </div>
                    )}
                    <div className="movie-grid">
                      {animeData?.pages.map((page) =>
                        page.data.map((anime) => (
                          <AnimePosterCard key={anime.mal_id} anime={anime} variant="bordered" />
                        )),
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div ref={ref} className="flex h-24 items-center justify-center">
            {isFetchingNext && (
              <Spinner color="primary" size="lg" variant="wave" label={getLoadingLabel()} />
            )}
            {!hasNext && !isPending && (!moviesEmpty || !tvEmpty || !animeEmpty) && (
              <p className="text-muted-foreground text-center text-base">
                You have reached the end of the list.
              </p>
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {!triggered && (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <Search className="text-default-200 text-6xl" />
          <p className="text-default-400 text-base">
            Click above or press{" "}
            <kbd className="bg-default-100 rounded px-1.5 py-0.5 text-xs">CTRL+K</kbd> to search
          </p>
        </div>
      )}

      <BackToTopButton />
    </div>
  );
};

export default SearchList;
