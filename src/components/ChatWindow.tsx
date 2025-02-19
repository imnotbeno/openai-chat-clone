import InputWithButton from "./InputWithButton";
import { Card } from "@/components/ui/card";
import MessageBubble from "./MessageBubble";
import { MouseEvent, FormEvent } from "react";
import { useState } from "react";
import axios from "axios";

interface Message {
  content: string;
  role: "user" | "bot";
}

function ChatWindow() {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleMessageSend = async (
    e: MouseEvent | FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const newMessage: Message = {
      content: prompt,
      role: "user",
    };

    setMessages([...messages, newMessage]);
    setPrompt("");

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

      setMessages([...messages, botMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
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
      </div>
      <div className="flex mt-4 gap-2">
        <InputWithButton
          buttonName="Send"
          placeholder="Ask me anything..."
          prompt={prompt}
          onClick={(event) => handleMessageSend(event)}
          onKeyDown={(event) => handleMessageSend(event)}
          onChange={(event) => handleInputChange(event)}
        />
      </div>
    </Card>
  );
}

export default ChatWindow;
