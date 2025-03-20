"use client"

import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChat } from "./chat-context"
import { cn } from "@/lib/utils"

export function ChatButton() {
  const { toggleChat, isChatOpen } = useChat()

  return (
    <Button
      onClick={toggleChat}
      className={cn(
        "fixed bottom-6 right-6 rounded-full p-3 shadow-lg z-40 transition-all duration-300",
        isChatOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90",
      )}
      aria-label="Chat with assistant"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  )
}

