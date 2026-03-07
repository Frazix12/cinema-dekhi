import { tmdb } from "@/api/tmdb";
import { jsonResponse, errorResponse, optionsResponse } from "../../helpers";
import { type NextRequest } from "next/server";

const VALID_TYPES = ["discover", "todayTrending", "thisWeekTrending", "popular", "nowPlaying", "upcoming", "topRated"] as const;
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
      discover: () => tmdb.discover.movie({ page, with_genres: genres }),
      todayTrending: () => tmdb.trending.trending("movie", "day", { page }),
      thisWeekTrending: () => tmdb.trending.trending("movie", "week", { page }),
      popular: () => tmdb.movies.popular({ page }),
      nowPlaying: () => tmdb.movies.nowPlaying({ page }),
      upcoming: () => tmdb.movies.upcoming({ page }),
      topRated: () => tmdb.movies.topRated({ page }),
    };

    const data = await queries[type]();
    return jsonResponse(data);
  } catch (error) {
    console.error("API /discover/movies error:", error);
    return errorResponse("Failed to fetch discover movies");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
