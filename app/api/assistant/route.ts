import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const response = await ollama.chat({
      model: "llama3",
      messages: [{ role: "user", content: prompt }],
      format: "json",
      stream: false,
    });

    return NextResponse.json({ message: response.message }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get response from LLM" },
      { status: 500 },
    );
  }
}
