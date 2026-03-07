import { tmdb } from "@/api/tmdb";
import { jsonResponse, errorResponse, optionsResponse } from "../../helpers";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const window = searchParams.get("window") === "week" ? "week" : "day";

    const data = await tmdb.trending.trending("movie", window);
    return jsonResponse(data);
  } catch (error) {
    console.error("API /movies/trending error:", error);
    return errorResponse("Failed to fetch trending movies");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
