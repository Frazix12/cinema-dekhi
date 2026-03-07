import { tmdb } from "@/api/tmdb";
import { jsonResponse, errorResponse, optionsResponse } from "../../../../helpers";

type Context = { params: Promise<{ id: string; seasonNumber: string }> };

export async function GET(_request: Request, context: Context) {
  try {
    const { id, seasonNumber } = await context.params;
    const tvId = Number(id);
    const season = Number(seasonNumber);

    if (isNaN(tvId)) {
      return errorResponse("Invalid TV show ID", 400);
    }

    if (isNaN(season)) {
      return errorResponse("Invalid season number", 400);
    }

    const data = await tmdb.tvSeasons.details({ tvShowID: tvId, seasonNumber: season }, ["images", "videos", "credits"]);

    return jsonResponse(data);
  } catch (error) {
    console.error("API /tv/[id]/season/[seasonNumber] error:", error);
    return errorResponse("Failed to fetch season details");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
