import { queryClient as q } from "@/app/providers";
import { siteConfig } from "@/config/site";
import { DISCOVER_MOVIES_VALID_QUERY_TYPES, DISCOVER_TVS_VALID_QUERY_TYPES, DISCOVER_ANIME_VALID_QUERY_TYPES } from "@/types/movie";
import { parseAsSet } from "@/utils/parsers";
import { useQueryState, parseAsStringLiteral, parseAsString, parseAsInteger } from "nuqs";
import { useCallback, useMemo, useEffect } from "react";

const VALID_CONTENT_TYPES = ["movie", "tv", "anime"] as const;
const DEFAULT_QUERY_TYPE = "discover";

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

  const types = useMemo(
    () => {
      if (content === "anime") {
        return [
          { name: "Discover", key: DEFAULT_QUERY_TYPE },
          { name: "TV Series", key: "tv" },
          { name: "Movies", key: "movie" },
          { name: "OVA", key: "ova" },
          ...siteConfig.queryLists.anime.map(({ name, param }) => ({
            name: name.replace(/(Movies|TV Shows|Anime)/gi, "").trim() || name,
            key: param,
          })),
        ];
      }

      const list = content === "movie" ? movies : tvShows;
      return [
        { name: "Discover", key: DEFAULT_QUERY_TYPE },
        ...list.map(({ name, param }) => ({
          name: name.replace(/(Movies|TV Shows|Anime)/gi, "").trim() || name,
          key: param,
        })),
      ]
    },
    [content, movies, tvShows],
  );

  const genresString = useMemo(
    () =>
      Array.from(genres)
        .filter((genre) => genre !== "")
        .join(","),
    [genres],
  );

  const resetFilters = useCallback(() => {
    setGenres(null);
    setQueryType(DEFAULT_QUERY_TYPE);
    setSortBy("popularity.desc");
    setRuntimeMin(0);
    setRuntimeMax(400);
  }, [setGenres, setQueryType, setSortBy, setRuntimeMin, setRuntimeMax]);

  const clearQueries = useCallback(() => {
    const queryKeys = ["discover-movies", "discover-tv-shows"];
    queryKeys.forEach((key) => {
      if (!q.isFetching({ queryKey: [key] })) {
        q.removeQueries({ queryKey: [key] });
      }
    });
  }, [q]);

  useEffect(() => {
    clearQueries();
  }, [content, queryType, genresString, sortBy, runtimeMin, runtimeMax]);

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
