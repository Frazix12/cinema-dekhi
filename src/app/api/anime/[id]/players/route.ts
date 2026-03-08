import { getAnilistId } from "@/api/anilist";
import { getAnimePlayers } from "@/utils/players";
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
    const episode = Number(searchParams.get("episode"));
    const type = searchParams.get("type") === "dub" ? "dub" : "sub";

    if (isNaN(episode) || episode < 1) {
      return errorResponse("Missing required query param: episode", 400);
    }

    const anilistId = await getAnilistId(animeId);

    if (!anilistId) {
      return errorResponse("Failed to map MAL anime ID to Anilist ID", 404);
    }

    const players = getAnimePlayers(anilistId, episode, type);
    return jsonResponse(players);
  } catch (error) {
    console.error("API /anime/[id]/players error:", error);
    return errorResponse("Failed to fetch anime players");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
