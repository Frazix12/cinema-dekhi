"use client";

import BackToTopButton from "@/components/ui/button/BackToTopButton";
import { Spinner } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { memo, useEffect } from "react";
import { jikan, PaginationInfo } from "@/api/jikan";
import AnimePosterCard from "./Cards/Poster";
import Loop from "@/components/ui/other/Loop";
import PosterCardSkeleton from "@/components/ui/other/PosterCardSkeleton";
import { getLoadingLabel } from "@/utils/movies";
import { notFound } from "next/navigation";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";

// Minimal interface for Anime data needed in list
export interface AnimeData {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  score: number;
  year: number;
  rating: string;
}

interface AnimeResponse {
  data: AnimeData[];
  pagination: PaginationInfo;
}

const AnimeList = () => {
  const { ref, inViewport } = useInViewport();
  const { queryType, genresString, sortBy } = useDiscoverFilters();

  const { data, isPending, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<AnimeResponse>({
      queryKey: ["discover-anime", queryType, genresString, sortBy],
      queryFn: async ({ pageParam }) => {
        if (queryType === "topAnime" && !genresString) {
          return jikan.topAnime(pageParam as number);
        }
        if (queryType === "upcomingAnime" && !genresString) {
          return jikan.discoverAnime(pageParam as number, "", "", "upcoming");
        }

        // Discover endpoint is more robust for genres and raw types
        return jikan.discoverAnime(
          pageParam as number,
          genresString,
          ["tv", "movie", "ova"].includes(queryType as string) ? queryType : "",
          "",
          sortBy
        );
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.pagination.has_next_page ? lastPage.pagination.current_page + 1 : undefined,
    });

  useEffect(() => {
    if (inViewport && !isPending && hasNextPage) {
      fetchNextPage();
    }
  }, [inViewport, isPending, hasNextPage, fetchNextPage]);

  if (status === "error") return notFound();

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-10">
        <div className="movie-grid">
          <Loop count={20} prefix="SkeletonAnimePosterCard">
            <PosterCardSkeleton variant="bordered" />
          </Loop>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="movie-grid">
        {data.pages.map((page, pageIndex) => {
          return page.data.map((anime, animeIndex) => {
            return <AnimePosterCard key={`${anime.mal_id}-${pageIndex}-${animeIndex}`} anime={anime} variant="bordered" />;
          });
        })}
      </div>
      <div ref={ref} className="flex h-24 items-center justify-center">
        {isFetchingNextPage && <Spinner size="lg" variant="wave" label={getLoadingLabel()} />}
        {!hasNextPage && !isPending && (
          <p className="text-muted-foreground text-center text-base">
            You have reached the end of the list.
          </p>
        )}
      </div>
      <BackToTopButton />
    </div>
  );
};

export default memo(AnimeList);
