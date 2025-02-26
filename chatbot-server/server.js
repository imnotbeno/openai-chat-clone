import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Frontend URL (Vite default)
      methods: ["GET", "POST"]
    }
});

app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY,
})

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send_message", async (data) => {
        console.log("Message received:", data);


        try {
            const stream = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: data.content }],
                stream: true,
            });
            
            const botMessage = {
                content: "",
                role: "bot",
            };

            for await (const chunk of stream) {
                if (chunk.choices?.[0]?.delta?.content) {
                    botMessage.content += chunk.choices[0]?.delta?.content;
                }
            }
            io.emit("receive_message", botMessage);

        } catch (error) {
            console.error(error);
            io.emit("receive_message", { content: "An error occurred", role: "bot" });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
  
server.listen(3001, () => {
    console.log("Server running on port 3001");
});
