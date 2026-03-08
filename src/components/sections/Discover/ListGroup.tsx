"use client";

import MovieDiscoverList from "./MovieList";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import DiscoverFilters from "./Filters";
import TvShowDiscoverList from "./TvShowList";
import AnimeList from "@/components/sections/Anime/AnimeList";

const DiscoverListGroup = () => {
  const { content } = useDiscoverFilters();

  return (
    <div className="flex flex-col gap-10">
      <DiscoverFilters />
      {content === "movie" && <MovieDiscoverList />}
      {content === "tv" && <TvShowDiscoverList />}
      {content === "anime" && <AnimeList />}
    </div>
  );
};

export default DiscoverListGroup;
