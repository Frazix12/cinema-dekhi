import { getMoviePlayers } from "@/utils/players";
import { jsonResponse, errorResponse, optionsResponse } from "../../../helpers";
import { type NextRequest } from "next/server";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const movieId = Number(id);

    if (isNaN(movieId)) {
      return errorResponse("Invalid movie ID", 400);
    }

    const { searchParams } = request.nextUrl;
    const startAt = Number(searchParams.get("startAt")) || undefined;

    const players = getMoviePlayers(movieId, startAt);
    return jsonResponse(players);
  } catch (error) {
    console.error("API /movies/[id]/players error:", error);
    return errorResponse("Failed to fetch movie players");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
