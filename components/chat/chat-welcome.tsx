"use client"

import { Button } from "@/components/ui/button"
import { useChat as useVercelChat } from "ai/react"

export function ChatWelcome() {
  const { setInput, handleSubmit } = useVercelChat()

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    handleSubmit(new Event("submit") as any)
  }

  const suggestions = [
    "Schedule an appointment",
    "Find a patient's records",
    "Check doctor availability",
    "Help with admission process",
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Here are some things you can ask me:</p>
      <div className="grid grid-cols-1 gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            className="justify-start h-auto py-2 px-3 text-sm"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}

