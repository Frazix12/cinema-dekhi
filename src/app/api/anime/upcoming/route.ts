import { jikan } from "@/api/jikan";
import { jsonResponse, errorResponse, optionsResponse } from "../../helpers";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page")) || 1;

    const data = await jikan.upcomingAnime(page);
    return jsonResponse(data);
  } catch (error) {
    console.error("API /anime/upcoming error:", error);
    return errorResponse("Failed to fetch upcoming anime");
  }
}

export async function OPTIONS() {
  return optionsResponse();
}
