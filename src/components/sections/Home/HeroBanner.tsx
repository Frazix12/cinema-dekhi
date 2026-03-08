"use client";

import { JikanAnimeSummary } from "@/api/jikan";
import { siteConfig } from "@/config/site";
import { getImageUrl, mutateMovieTitle, mutateTvShowTitle } from "@/utils/movies";
import { Button, Chip, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import { FaInfoCircle, FaPlay } from "react-icons/fa";

const getAnimeBackdrop = (item: JikanAnimeSummary) => {
  const embed = item.trailer?.embed_url;
  if (embed && embed.includes("/embed/")) {
    const youtubeId = embed.split("/embed/")[1]?.split("?")[0];
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }
  }

  return item.images?.jpg?.large_image_url || item.images?.jpg?.image_url;
};

const HeroBanner = () => {
  const [content] = useQueryState(
    "content",
    parseAsStringLiteral(["movie", "tv", "anime"]).withDefault("movie"),
  );

  const queryFn =
    content === "movie"
      ? siteConfig.queryLists.movies[0].query
      : content === "tv"
        ? siteConfig.queryLists.tvShows[0].query
        : siteConfig.queryLists.anime[0].query;

  const { data, isPending } = useQuery({
    queryFn: queryFn as () => Promise<{ results: any[] }>,
    queryKey: ["hero-banner", content],
  });

  if (isPending || !data?.results?.[0]) {
    return <Skeleton className="h-[400px] w-full rounded-2xl md:h-[500px] lg:h-[600px]" />;
  }

  const item = data.results[0] as any;
  const animeItem = item as JikanAnimeSummary;
  const isMovie = content === "movie";
  const isTv = content === "tv";
  const isAnime = content === "anime";
  const accentColor: "primary" | "warning" | "secondary" = isMovie
    ? "primary"
    : isTv
      ? "warning"
      : "secondary";

  const title = isMovie
    ? mutateMovieTitle(item)
    : isTv
      ? mutateTvShowTitle(item)
      : animeItem.title_english || animeItem.title;

  const score = isAnime ? animeItem.score : item.vote_average;
  const year = isMovie
    ? item.release_date?.substring(0, 4)
    : isTv
      ? item.first_air_date?.substring(0, 4)
      : animeItem.year || animeItem.aired?.prop?.from?.year;
  const overview = isAnime ? animeItem.synopsis : item.overview;
  const backgroundImage = isAnime
    ? getAnimeBackdrop(animeItem)
    : getImageUrl(item.backdrop_path, "backdrop", true);

  const watchHref = isMovie
    ? `/movie/${item.id}/player`
    : isTv
      ? `/tv/${item.id}`
      : `/stream/anime/${animeItem.mal_id}/1`;
  const detailsHref = isAnime ? `/anime/${animeItem.mal_id}` : `/${content}/${item.id}`;

  const watchLabel = isAnime
    ? animeItem.type?.toLowerCase() === "movie"
      ? "Watch Anime Movie"
      : "Play Episode 1"
    : isTv
      ? "View Episodes"
      : "Watch Now";

  return (
    <div className="group relative mt-4 h-[400px] w-full overflow-hidden rounded-2xl md:h-[500px] lg:h-[600px]">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="from-background via-background/60 absolute inset-0 bg-gradient-to-t to-transparent" />
      <div className="from-background via-background/40 absolute inset-0 bg-gradient-to-r to-transparent" />

      <div className="absolute bottom-0 left-0 flex w-full flex-col gap-4 p-6 md:w-2/3 md:p-12">
        <div className="flex flex-wrap items-center gap-2">
          <Chip size="sm" color={accentColor} variant="flat">
            {isMovie ? "Movie" : isTv ? "TV Show" : animeItem.type || "Anime"}
          </Chip>
          {score && (
            <Chip
              size="sm"
              variant="faded"
              className="border-transparent bg-white/10 text-white backdrop-blur-md"
            >
              ★ {score.toFixed(1)}
            </Chip>
          )}
          {year && (
            <Chip
              size="sm"
              variant="faded"
              className="border-transparent bg-white/10 text-white backdrop-blur-md"
            >
              {year}
            </Chip>
          )}
          {isAnime && animeItem.status && (
            <Chip
              size="sm"
              variant="faded"
              className="border-transparent bg-white/10 text-white backdrop-blur-md"
            >
              {animeItem.status}
            </Chip>
          )}
          {isAnime && animeItem.episodes && (
            <Chip
              size="sm"
              variant="faded"
              className="border-transparent bg-white/10 text-white backdrop-blur-md"
            >
              {animeItem.episodes} eps
            </Chip>
          )}
        </div>

        <h1 className="text-3xl leading-tight font-black text-white drop-shadow-lg md:text-5xl lg:text-5xl">
          {title}
        </h1>

        <p className="line-clamp-2 max-w-2xl text-sm text-white/80 drop-shadow-md md:line-clamp-3 md:text-base">
          {overview}
        </p>

        <div className="mt-2 flex items-center gap-3">
          <Button
            as={Link}
            href={watchHref}
            color={accentColor}
            className="px-6 text-white shadow-lg md:px-8"
            startContent={<FaPlay />}
            size="lg"
            radius="full"
          >
            {watchLabel}
          </Button>
          <Button
            as={Link}
            href={detailsHref}
            variant="flat"
            className="border border-white/10 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20"
            startContent={<FaInfoCircle />}
            size="lg"
            radius="full"
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
