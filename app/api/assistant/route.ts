import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt } = body;
  const HF_TOKEN = process.env.HUGGING_FACE_API_KEY;

  // Check if prompt is undefined, null, empty string, or only whitespace
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/aubmindlab/aragpt2-base",

    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 150, temperature: 0.7 },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json(
      {
        error: `API Error: ${error}`,
      },
      { status: 400 }
    );
  }
  const json = await response.json();

  const reply = json.generated_text || "لم يتم الحصول على رد.";
  return NextResponse.json({ reply });
}
