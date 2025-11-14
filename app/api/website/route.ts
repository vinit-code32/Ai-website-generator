export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Ensure messages are formatted correctly
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "tngtech/deepseek-r1t2-chimera:free",
        messages,
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API}`,
          "Content-Type": "application/json",
        },
        responseType: "stream",
      }
    );

    const stream = response.data;
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        stream.on("data", (chunk: any) => {
          const payloads = chunk.toString().split("\n\n");
          for (const payload of payloads) {
            if (payload.includes("[DONE]")) {
              controller.close();
              return;
            }
            if (payload.startsWith("data:")) {
              try {
                const data = JSON.parse(payload.replace("data:", ""));
                const text = data.choices[0]?.delta?.content;
                if (text) controller.enqueue(encoder.encode(text));
              } catch (err) {
                console.error("Error parsing stream", err);
              }
            }
          }
        });
        stream.on("end", () => controller.close());
        stream.on("error", (err: any) => controller.error(err));
      },
    });

    return new NextResponse(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: any) {
  // Log to see what the server actually returns
  console.error("API error:", error?.response?.data || error?.message);

  // Extract readable message safely
  const message =
    typeof error?.response?.data === "string"
      ? error.response.data
      : error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

  // Return only serializable JSON
  return NextResponse.json({ error: message }, { status: 500 });
}
}
