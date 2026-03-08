"use client";

import { useQuery } from "@tanstack/react-query";
import { siteConfig } from "@/config/site";
import { Button, Chip, Skeleton } from "@heroui/react";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { getImageUrl, mutateMovieTitle, mutateTvShowTitle } from "@/utils/movies";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import Link from "next/link";

const HeroBanner = () => {
  const [content] = useQueryState(
    "content",
    parseAsStringLiteral(["movie", "tv"]).withDefault("movie")
  );

  const queryFn = (content === "movie"
    ? siteConfig.queryLists.movies[0].query
    : siteConfig.queryLists.tvShows[0].query) as unknown as () => Promise<any>;

  const { data, isPending } = useQuery({
    queryFn,
    queryKey: ["hero-banner", content],
  });

  if (isPending || !data?.results?.[0]) {
    return <Skeleton className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl" />;
  }

  const item = data.results[0] as any;
  const title = content === "movie" ? mutateMovieTitle(item) : mutateTvShowTitle(item);
  const isMovie = content === "movie";

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden mt-4 group">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${getImageUrl(item.backdrop_path, "backdrop", true)})` }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3 flex flex-col gap-4">
        {/* Metadata Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Chip size="sm" color="primary" variant="flat">
            {isMovie ? "Movie" : "TV Show"}
          </Chip>
          {item.vote_average && (
            <Chip size="sm" variant="faded" className="bg-white/10 text-white backdrop-blur-md border-transparent">
              ★ {item.vote_average.toFixed(1)}
            </Chip>
          )}
          <Chip size="sm" variant="faded" className="bg-white/10 text-white backdrop-blur-md border-transparent">
            {isMovie ? item.release_date?.substring(0, 4) : item.first_air_date?.substring(0, 4)}
          </Chip>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-white drop-shadow-lg leading-tight">
          {title}
        </h1>

        <p className="text-white/80 line-clamp-2 md:line-clamp-3 max-w-2xl text-sm md:text-base drop-shadow-md">
          {item.overview}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <Button
            as={Link}
            href={`/player/${content}/${item.id}`}
            color="primary"
            className="font-semibold px-6 md:px-8 text-white shadow-lg shadow-primary/30"
            startContent={<FaPlay />}
            size="lg"
            radius="full"
          >
            Watch Now
          </Button>
          <Button
            as={Link}
            href={`/${content}/${item.id}`}
            variant="flat"
            className="font-semibold bg-white/10 text-white backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all shadow-lg shadow-black/30"
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
