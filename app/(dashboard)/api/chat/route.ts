import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { aiTools } from "@/lib/ai/ai-queries-tools";

export async function POST(req: Request) {
  try {
    // Extract messages and optional model from request
    const { messages } = await req.json();

    // System message to help guide the model's behavior
    const systemPrompt = `You are MediAssist AI, a helpful assistant for hospital administrators.
      You can provide insights on scheduling, patient management, and hospital operations.
      When asked about scheduling optimization, department workload, or appointment suggestions,
      you should use the appropriate tools to provide data-driven recommendations.
      Be professional, concise, and helpful.`;

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: google("gemini-1.5-flash"),
          system: systemPrompt,
          messages,
          tools: aiTools,
          experimental_transform: smoothStream({ chunking: "word" }),
        });

        result.consumeStream();
        result.mergeIntoDataStream(dataStream);
      },
      onError: (error) => {
        console.error("Chat API error:", error);
        return "An error occurred while processing your request. Please try again.";
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  return new Response("Chat deletion not implemented", { status: 501 });
}
