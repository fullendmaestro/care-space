import { google } from "@ai-sdk/google";

import { customMiddleware } from "./custom-middleware";
import { wrapLanguageModel } from "ai";

// @ts-expect-error - Suppressing AI SDK version incompatibility
export const geminiProModel = wrapLanguageModel({
  model: google("gemini-1.5-pro-002"),
  middleware: customMiddleware,
});

// @ts-expect-error - Suppressing AI SDK version incompatibility
export const geminiFlashModel = wrapLanguageModel({
  model: google("gemini-1.5-flash-002"),
  middleware: customMiddleware,
});
