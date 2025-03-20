"use client"

import type { Message } from "ai"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatMessage({ message }: { message: Message }) {
  return (
    <div className={cn("flex gap-3 items-start", message.role === "user" ? "justify-end" : "justify-start")}>
      {message.role === "assistant" && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <Bot className="h-5 w-5" />
        </div>
      )}

      <div
        className={cn(
          "rounded-lg p-3 max-w-[80%]",
          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {message.content}
      </div>

      {message.role === "user" && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  )
}

