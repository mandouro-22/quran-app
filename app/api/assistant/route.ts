import { NextRequest, NextResponse } from "next/server";

export default function handler(req: NextRequest) {
  const { prompt } = req.body;

  // Check if prompt is undefined, null, empty string, or only whitespace
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }
}
