"use client";

import type React from "react";

import { useRef, useEffect } from "react";
import { useChat as useVercelChat } from "@ai-sdk/react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "./chat-context";
import { ChatMessage } from "./chat-message";

export function ChatInterface() {
  const { isChatOpen, closeChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useVercelChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your Care-Space assistant. How can I help you today with scheduling, patient information, or other hospital management tasks?",
      },
    ],
    onFinish: () => {
      scrollToBottom();

      // Check if the last message is about scheduling an appointment
      const lastMessage = messages[messages.length - 1];
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [isChatOpen, messages.length]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-80 sm:w-96 h-[500px] bg-background border rounded-lg shadow-lg z-40 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground">
        <h3 className="font-semibold">Care-Space Assistant</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeChat}
          className="h-8 w-8 rounded-full hover:bg-primary-foreground/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* {messages.length === 1 && <ChatWelcome />} */}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleFormSubmit} className="p-3 border-t flex gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
