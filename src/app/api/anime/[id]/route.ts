import { jikan } from "@/api/jikan";
import { jsonResponse, errorResponse, optionsResponse } from "../../helpers";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const animeId = Number(id);

    if (isNaN(animeId)) {
      return errorResponse("Invalid anime ID", 400);
    }

    const data = await jikan.getAnimeDetails(animeId);
    return jsonResponse(data);
  } catch (error) {
    console.error("API /anime/[id] error:", error);
    return errorResponse("Failed to fetch anime details");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
