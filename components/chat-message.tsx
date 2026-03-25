import { Bot, User } from "lucide-react"
import type { Message } from "@/types/simulation"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant"

  return (
    <div className={`flex items-start gap-3 ${isAssistant ? "" : "flex-row-reverse"}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAssistant ? "bg-primary/10" : "bg-accent/10"
        }`}
      >
        {isAssistant ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-accent" />}
      </div>
      <div className="flex-1">
        <div
          className={`rounded-lg p-4 inline-block max-w-[85%] ${
            isAssistant ? "bg-muted" : "bg-primary text-primary-foreground"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  )
}
