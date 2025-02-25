import InputWithButton from "./InputWithButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MessageBubble from "./MessageBubble";
import { MouseEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";

interface Message {
  content: string;
  role: "user" | "bot";
}

function ChatWindow() {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const handleMessageSend = async (
    e: MouseEvent | FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const newMessage: Message = {
      content: prompt,
      role: "user",
    };

    setMessages((messages) => [...messages, newMessage]);
    setPrompt("");

    setIsTyping(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage: Message = {
        content: response.data.choices[0].message.content,
        role: "bot",
      };

      setMessages((messages) => [...messages, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((messages) => [
        ...messages,
        { content: "An error occurred", role: "bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem("messages");
  };

  return (
    <Card className="w-full max-w-md mx-auto p-4 rounded-lg shadow-md">
      <div className="h-80 overflow-y-auto p-2 border border-gray-300 rounded bg-gray-50">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            text={message.content}
            sender={message.role}
          />
        ))}
        {isTyping && (
          <p className="text-gray-500 text-sm mt-2">Bot is typing...</p>
        )}
      </div>
      <div className="flex gap-2">
        <div className="mt-4">
          <InputWithButton
            buttonName="Send"
            placeholder="Ask me anything..."
            prompt={prompt}
            onClick={(event) => handleMessageSend(event)}
            onKeyDown={(event) => handleMessageSend(event)}
            onChange={(event) => handleInputChange(event)}
          />
        </div>
        <div className="justify-end mt-8">
          <Button variant="destructive" onClick={() => handleClearChat()}>
            Clear Chat
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ChatWindow;
