import { cn } from "@/lib/utils";
interface MessageBubbleProps {
  text: string;
  sender: "user" | "bot";
}

function MessageBubble({ text, sender }: MessageBubbleProps) {
  const isUser = sender === "user";

  return (
    <div className={cn("flex mb-2", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "p-3 rounded-lg shadow",
          isUser ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
        )}
      >
        {text}
      </div>
    </div>
  );
}

export default MessageBubble;
