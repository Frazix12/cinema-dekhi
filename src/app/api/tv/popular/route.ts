import { tmdb } from "@/api/tmdb";
import { jsonResponse, errorResponse, optionsResponse } from "../../helpers";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page")) || 1;

    const data = await tmdb.tvShows.popular({ page });
    return jsonResponse(data);
  } catch (error) {
    console.error("API /tv/popular error:", error);
    return errorResponse("Failed to fetch popular TV shows");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
