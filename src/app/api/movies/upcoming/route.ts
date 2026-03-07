import { tmdb } from "@/api/tmdb";
import { jsonResponse, errorResponse, optionsResponse } from "../../helpers";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page")) || 1;

    const data = await tmdb.movies.upcoming({ page });
    return jsonResponse(data);
  } catch (error) {
    console.error("API /movies/upcoming error:", error);
    return errorResponse("Failed to fetch upcoming movies");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
