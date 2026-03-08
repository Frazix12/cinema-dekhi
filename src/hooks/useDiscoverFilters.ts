import { siteConfig } from "@/config/site";
import {
  DISCOVER_MOVIES_VALID_QUERY_TYPES,
  DISCOVER_TVS_VALID_QUERY_TYPES,
  DISCOVER_ANIME_VALID_QUERY_TYPES,
} from "@/types/movie";
import { parseAsSet } from "@/utils/parsers";
import { useQueryState, parseAsStringLiteral, parseAsString, parseAsInteger } from "nuqs";
import { useCallback, useMemo, useEffect } from "react";

const VALID_CONTENT_TYPES = ["movie", "tv", "anime"] as const;
const DEFAULT_QUERY_TYPE = "discover";
const DEFAULT_TMDB_SORT = "popularity.desc";
const DEFAULT_ANIME_SORT = "popularity";

const TMDB_SORT_KEYS = [
  "popularity.desc",
  "vote_average.desc",
  "primary_release_date.desc",
  "revenue.desc",
] as const;

const ANIME_SORT_KEYS = ["popularity", "score", "episodes", "start_date"] as const;

const ANIME_TYPE_OPTIONS = [
  { name: "Discover", key: "discover" },
  { name: "Top Anime", key: "topAnime" },
  { name: "Upcoming", key: "upcomingAnime" },
  { name: "TV Series", key: "tv" },
  { name: "Movies", key: "movie" },
  { name: "OVA", key: "ova" },
] as const;

const useDiscoverFilters = () => {
  const { movies, tvShows } = siteConfig.queryLists;

  const [genres, setGenres] = useQueryState("genres", parseAsSet.withDefault(new Set([])));
  const [queryType, setQueryType] = useQueryState(
    "type",
    parseAsStringLiteral([
      ...DISCOVER_MOVIES_VALID_QUERY_TYPES,
      ...DISCOVER_TVS_VALID_QUERY_TYPES,
      ...DISCOVER_ANIME_VALID_QUERY_TYPES,
    ]).withDefault(DEFAULT_QUERY_TYPE),
  );
  const [content, setContent] = useQueryState(
    "content",
    parseAsStringLiteral(VALID_CONTENT_TYPES).withDefault("movie"),
  );

  const [sortBy, setSortBy] = useQueryState("sortBy", parseAsString.withDefault("popularity.desc"));
  const [runtimeMin, setRuntimeMin] = useQueryState("runtimeMin", parseAsInteger.withDefault(0));
  const [runtimeMax, setRuntimeMax] = useQueryState("runtimeMax", parseAsInteger.withDefault(400));

  const types = useMemo(() => {
    if (content === "anime") return ANIME_TYPE_OPTIONS;

    const list = content === "movie" ? movies : tvShows;
    return [
      { name: "Discover", key: DEFAULT_QUERY_TYPE },
      ...list.map(({ name, param }) => ({
        name: name.replace(/(Movies|TV Shows|Anime)/gi, "").trim() || name,
        key: param,
      })),
    ];
  }, [content, movies, tvShows]);

  const genresString = useMemo(
    () =>
      Array.from(genres)
        .filter((genre) => genre !== "")
        .join(","),
    [genres],
  );

  const resetFilters = useCallback(
    (nextContent?: (typeof VALID_CONTENT_TYPES)[number]) => {
      const targetContent = nextContent || content;

      setGenres(null);
      setQueryType(DEFAULT_QUERY_TYPE);
      setSortBy(targetContent === "anime" ? DEFAULT_ANIME_SORT : DEFAULT_TMDB_SORT);
      setRuntimeMin(0);
      setRuntimeMax(400);
    },
    [content, setGenres, setQueryType, setSortBy, setRuntimeMin, setRuntimeMax],
  );

  useEffect(() => {
    if (
      content === "anime" &&
      !ANIME_SORT_KEYS.includes(sortBy as (typeof ANIME_SORT_KEYS)[number])
    ) {
      setSortBy(DEFAULT_ANIME_SORT);
      return;
    }

    if (
      content !== "anime" &&
      !TMDB_SORT_KEYS.includes(sortBy as (typeof TMDB_SORT_KEYS)[number])
    ) {
      setSortBy(DEFAULT_TMDB_SORT);
    }
  }, [content, setSortBy, sortBy]);

  return {
    types,
    genres,
    queryType,
    content,
    genresString,
    sortBy,
    runtimeMin,
    runtimeMax,
    setGenres,
    setQueryType,
    setContent,
    setSortBy,
    setRuntimeMin,
    setRuntimeMax,
    resetFilters,
  };
};

export default useDiscoverFilters;
