import { getTvShowPlayers } from "@/utils/players";
import { jsonResponse, errorResponse, optionsResponse } from "../../../helpers";
import { type NextRequest } from "next/server";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const tvId = Number(id);

    if (isNaN(tvId)) {
      return errorResponse("Invalid TV show ID", 400);
    }

    const { searchParams } = request.nextUrl;
    const season = Number(searchParams.get("season"));
    const episode = Number(searchParams.get("episode"));
    const startAt = Number(searchParams.get("startAt")) || undefined;

    if (!season || !episode) {
      return errorResponse("Missing required query params: season and episode", 400);
    }

    const players = getTvShowPlayers(tvId, season, episode, startAt);
    return jsonResponse(players);
  } catch (error) {
    console.error("API /tv/[id]/players error:", error);
    return errorResponse("Failed to fetch TV show players");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
