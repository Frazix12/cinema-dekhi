import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth") &&
    !pathname.startsWith("/api/player")
  ) {
    const authHeader = request.headers.get("authorization");
    let apiKey = request.nextUrl.searchParams.get("api_key") || request.headers.get("x-api-key");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      apiKey = authHeader.substring(7);
    }

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Missing API Key. Provide it via API-Key, Bearer token, or ?api_key query parameter." },
        { status: 401 }
      );
    }

    // Verify the key using Supabase edge-compatible fetch
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return []; },
          setAll() { },
        },
      }
    );

    const { data: keyData, error } = await supabase
      .from("api_keys")
      .select("id")
      .eq("key", apiKey)
      .single();

    if (error || !keyData) {
      return NextResponse.json(
        { success: false, error: "Invalid API Key" },
        { status: 401 }
      );
    }
  }

  // Update user's auth session
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
