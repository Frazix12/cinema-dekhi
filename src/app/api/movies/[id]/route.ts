import { tmdb } from "@/api/tmdb";
import { jsonResponse, errorResponse, optionsResponse } from "../../helpers";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const movieId = Number(id);

    if (isNaN(movieId)) {
      return errorResponse("Invalid movie ID", 400);
    }

    const data = await tmdb.movies.details(movieId, [
      "images",
      "videos",
      "credits",
      "keywords",
      "recommendations",
      "similar",
      "reviews",
      "watch/providers",
    ]);

    return jsonResponse(data);
  } catch (error) {
    console.error("API /movies/[id] error:", error);
    return errorResponse("Failed to fetch movie details");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
