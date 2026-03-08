import { jikan } from "@/api/jikan";
import { jsonResponse, errorResponse, optionsResponse } from "../../../helpers";
import { type NextRequest } from "next/server";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const animeId = Number(id);

    if (isNaN(animeId)) {
      return errorResponse("Invalid anime ID", 400);
    }

    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page")) || 1;

    const data = await jikan.getAnimeEpisodes(animeId, page);
    return jsonResponse(data);
  } catch (error) {
    console.error("API /anime/[id]/episodes error:", error);
    return errorResponse("Failed to fetch anime episodes");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
