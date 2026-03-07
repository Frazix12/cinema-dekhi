import { tmdb } from "@/api/tmdb";
import { jsonResponse, errorResponse, optionsResponse } from "../../helpers";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const window = searchParams.get("window") === "week" ? "week" : "day";

    const data = await tmdb.trending.trending("tv", window);
    return jsonResponse(data);
  } catch (error) {
    console.error("API /tv/trending error:", error);
    return errorResponse("Failed to fetch trending TV shows");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
