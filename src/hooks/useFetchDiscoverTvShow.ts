"use client";

import { tmdb } from "@/api/tmdb";
import { DiscoverTvShowsFetchQueryType } from "@/types/movie";
import { filterPagedFeedResults } from "@/utils/movies";
import { TV } from "tmdb-ts/dist/types";
import { TvShowDiscoverResult } from "tmdb-ts/dist/types/discover";

interface FetchDiscoverTvShows {
  page?: number;
  type?: DiscoverTvShowsFetchQueryType;
  genres?: string;
  sortBy?: string;
  runtimeMin?: number;
  runtimeMax?: number;
}

const fetchDiscoverTvShows = ({
  page = 1,
  type = "discover",
  genres,
  sortBy,
  runtimeMin,
  runtimeMax,
}: FetchDiscoverTvShows): Promise<TvShowDiscoverResult> => {
  const discover = () =>
    tmdb.discover.tvShow({
      page: page,
      with_genres: genres,
      sort_by: sortBy as any,
      "with_runtime.gte": runtimeMin,
      "with_runtime.lte": runtimeMax,
    });
  const todayTrending = () => tmdb.trending.trending("tv", "day", { page: page });
  const thisWeekTrending = () => tmdb.trending.trending("tv", "week", { page: page });
  const popular = () => tmdb.tvShows.popular({ page: page });
  const onTheAir = () => tmdb.tvShows.onTheAir({ page: page });
  const topRated = () => tmdb.tvShows.topRated({ page: page });

  const queryData = {
    discover,
    todayTrending,
    thisWeekTrending,
    popular,
    onTheAir,
    topRated,
  }[type];

  return queryData().then((response) => {
    const filtered = filterPagedFeedResults(response);

    return {
      ...filtered,
      results: filtered.results.map((tv) => ({ adult: false, ...tv })) as TV[],
    } as TvShowDiscoverResult;
  });
};

export default fetchDiscoverTvShows;
