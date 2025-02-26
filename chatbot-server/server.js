import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import axios from "axios";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Frontend URL (Vite default)
      methods: ["GET", "POST"]
    }
});

app.use(cors());

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send_message", async (data) => {
        console.log("Message received:", data);


        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: data.content }],
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.VITE_OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const botMessage = {
                content: response.data.choices[0].message.content,
                role: "bot",
            };

            io.emit("receive_message", botMessage);
        } catch (error) {
            console.error(error);
            io.emit("receive_message", { content: "An error occurred", role: "bot" });
        }
    
        // Simulate bot response
        setTimeout(() => {
        io.emit("receive_message", { text: `Echo: ${data.text}`, sender: "bot" });
        }, 1000);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
  
server.listen(3001, () => {
    console.log("Server running on port 3001");
});
