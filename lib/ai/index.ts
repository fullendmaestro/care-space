import { google } from "@ai-sdk/google";
import { wrapLanguageModel, type LanguageModelV1 } from "ai";

import { customMiddleware } from "./custom-middleware";

// Use type assertion to resolve version mismatch between @ai-sdk/provider@1.0.12 and @1.0.9
export const geminiProModel = wrapLanguageModel({
  model: google("gemini-1.5-pro-002") as unknown as LanguageModelV1,
  middleware: customMiddleware,
});

export const geminiFlashModel = wrapLanguageModel({
  model: google("gemini-1.5-flash-002") as unknown as LanguageModelV1,
  middleware: customMiddleware,
});
