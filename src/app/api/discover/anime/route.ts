import { jikan } from "@/api/jikan";
import { DISCOVER_ANIME_VALID_QUERY_TYPES } from "@/types/movie";
import { jsonResponse, errorResponse, optionsResponse } from "../../helpers";
import { type NextRequest } from "next/server";

type QueryType = (typeof DISCOVER_ANIME_VALID_QUERY_TYPES)[number];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page")) || 1;
    const type = (searchParams.get("type") as QueryType) || "discover";
    const genres = searchParams.get("genres") || "";
    const statusParam = searchParams.get("status") || "";
    const allowedStatus = ["airing", "complete", "upcoming"];
    const status = allowedStatus.includes(statusParam) ? statusParam : "";
    const orderBy =
      searchParams.get("sortBy") ||
      searchParams.get("orderBy") ||
      searchParams.get("order_by") ||
      "";

    if (!DISCOVER_ANIME_VALID_QUERY_TYPES.includes(type)) {
      return errorResponse(
        `Invalid type. Must be one of: ${DISCOVER_ANIME_VALID_QUERY_TYPES.join(", ")}`,
        400,
      );
    }

    const queries: Record<QueryType, () => Promise<unknown>> = {
      discover: () => jikan.discoverAnime(page, genres, "", status, orderBy),
      topAnime: () =>
        genres || status || orderBy
          ? jikan.discoverAnime(page, genres, "", status, orderBy || "score")
          : jikan.topAnime(page),
      upcomingAnime: () =>
        genres || orderBy
          ? jikan.discoverAnime(page, genres, "", "upcoming", orderBy || "popularity")
          : jikan.upcomingAnime(page),
      tv: () => jikan.discoverAnime(page, genres, "tv", status, orderBy),
      movie: () => jikan.discoverAnime(page, genres, "movie", status, orderBy),
      ova: () => jikan.discoverAnime(page, genres, "ova", status, orderBy),
    };

    const data = await queries[type]();
    return jsonResponse(data);
  } catch (error) {
    console.error("API /discover/anime error:", error);
    return errorResponse("Failed to fetch discover anime");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
