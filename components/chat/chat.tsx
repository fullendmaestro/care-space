"use client"

import { ChatProvider } from "./chat-context"
import { ChatButton } from "./chat-button"
import { ChatInterface } from "./chat-interface"

export function Chat() {
  return (
    <ChatProvider>
      <ChatButton />
      <ChatInterface />
    </ChatProvider>
  )
}

