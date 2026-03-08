import { NextResponse } from "next/server";

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
  };
}

export function jsonResponse<T>(data: T, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status, headers: corsHeaders() });
}

export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ success: false, error: message }, { status, headers: corsHeaders() });
}

export function optionsResponse() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
