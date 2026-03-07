import { tmdb } from "@/api/tmdb";
import { jsonResponse, errorResponse, optionsResponse } from "../../helpers";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const tvId = Number(id);

    if (isNaN(tvId)) {
      return errorResponse("Invalid TV show ID", 400);
    }

    const data = await tmdb.tvShows.details(tvId, [
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
    console.error("API /tv/[id] error:", error);
    return errorResponse("Failed to fetch TV show details");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
