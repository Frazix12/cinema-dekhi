import { tmdb } from "@/api/tmdb";
import { jsonResponse, errorResponse, optionsResponse } from "../../helpers";
import { type NextRequest } from "next/server";
import { filterPagedFeedResults } from "@/utils/movies";

const VALID_TYPES = [
  "discover",
  "todayTrending",
  "thisWeekTrending",
  "popular",
  "onTheAir",
  "topRated",
] as const;
type QueryType = (typeof VALID_TYPES)[number];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page")) || 1;
    const type = (searchParams.get("type") as QueryType) || "discover";
    const genres = searchParams.get("genres") || undefined;

    if (!VALID_TYPES.includes(type)) {
      return errorResponse(`Invalid type. Must be one of: ${VALID_TYPES.join(", ")}`, 400);
    }

    const queries: Record<QueryType, () => Promise<any>> = {
      discover: () => tmdb.discover.tvShow({ page, with_genres: genres }),
      todayTrending: () => tmdb.trending.trending("tv", "day", { page }),
      thisWeekTrending: () => tmdb.trending.trending("tv", "week", { page }),
      popular: () => tmdb.tvShows.popular({ page }),
      onTheAir: () => tmdb.tvShows.onTheAir({ page }),
      topRated: () => tmdb.tvShows.topRated({ page }),
    };

    const filtered = filterPagedFeedResults(await queries[type]());
    const data = {
      ...filtered,
      results: filtered.results.map((tv: Record<string, unknown>) => ({ adult: false, ...tv })),
    };
    return jsonResponse(data);
  } catch (error) {
    console.error("API /discover/tv error:", error);
    return errorResponse("Failed to fetch discover TV shows");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
