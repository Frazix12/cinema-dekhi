import { tmdb } from "@/api/tmdb";
import { jikan } from "@/api/jikan";
import { jsonResponse, errorResponse, optionsResponse } from "../helpers";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("query");
    const page = Number(searchParams.get("page")) || 1;

    if (!query || query.trim().length === 0) {
      return errorResponse("Missing required query param: query", 400);
    }

    const [movies, tvShows, anime] = await Promise.all([
      tmdb.search.movies({ query, page }),
      tmdb.search.tvShows({ query, page }),
      jikan.searchAnime(query, page),
    ]);

    return jsonResponse({
      movies: movies.results,
      tvShows: tvShows.results,
      anime: anime.data,
      totalMovieResults: movies.total_results,
      totalTvResults: tvShows.total_results,
      totalAnimeResults: anime.pagination.items.total,
      page,
      totalMoviePages: movies.total_pages,
      totalTvPages: tvShows.total_pages,
      totalAnimePages: anime.pagination.last_visible_page,
    });
  } catch (error) {
    console.error("API /search error:", error);
    return errorResponse("Failed to search");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
