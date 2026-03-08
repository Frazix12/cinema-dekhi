"use client";

import { jikan } from "@/api/jikan";
import { cn } from "@/utils/helpers";
import { Button, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useQueryState, parseAsStringLiteral } from "nuqs";

const MOVIE_CATEGORIES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const TV_CATEGORIES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

const CategoryScroll = () => {
  const [content] = useQueryState(
    "content",
    parseAsStringLiteral(["movie", "tv", "anime"]).withDefault("movie"),
  );

  const { data: animeGenres, isPending: isAnimeGenresPending } = useQuery({
    queryFn: jikan.getAnimeGenres,
    queryKey: ["anime-home-genres"],
    enabled: content === "anime",
  });

  const animeCategories =
    animeGenres?.data?.slice(0, 20).map((genre) => ({ id: genre.mal_id, name: genre.name })) || [];
  const categories =
    content === "movie" ? MOVIE_CATEGORIES : content === "tv" ? TV_CATEGORIES : animeCategories;
  const isAnime = content === "anime";
  const accentClass =
    content === "movie"
      ? "hover:border-primary/35"
      : content === "tv"
        ? "hover:border-warning/35"
        : "hover:border-secondary/35";

  if (content === "anime" && isAnimeGenresPending) {
    return <Skeleton className="my-2 h-10 w-full rounded-full" />;
  }

  return (
    <div
      className={cn("my-2 w-full py-2", {
        "overflow-x-hidden": isAnime,
        "mask-linear no-scrollbar overflow-x-auto": !isAnime,
      })}
    >
      <div
        className={cn("flex gap-2 px-1", {
          "w-max": !isAnime,
          "w-full flex-wrap": isAnime,
        })}
      >
        {categories.map((cat) => (
          <Button
            key={cat.id}
            as={Link}
            href={`/discover?content=${content}&genres=${cat.id}`}
            variant="flat"
            size="sm"
            className={`rounded-full border border-white/5 bg-white/5 text-white/70 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:text-white ${accentClass}`}
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
