import OpenAI from "openai";

export const runtime = "edge";

export async function POST(req: Request) {
  const formData = await req.formData();
  const input = formData.get("input") as string;
  const token = formData.get("token") as string;

  if (!token && !process.env.OPENAI_API_KEY) {
    return Response.json({
      error: "No API key provided.",
    });
  }

  const openai = new OpenAI({
    apiKey: token || process.env.OPENAI_API_KEY,
  });

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input,
    speed: 1.3,
    response_format: "opus",
  });

  // Fetching the audio data as an ArrayBuffer
  const arrayBuffer = await mp3.arrayBuffer();

  // Converting ArrayBuffer to Blob
  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });

  // Returning the Blob directly to the client
  return new Response(blob, {
    headers: {
      "Content-Type": "audio/ogg",
    },
  });
}
