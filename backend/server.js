// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import textRoutes from "./src/routes/text.js";
import imageRoutes from "./src/routes/image.js";

dotenv.config();
const app = express();
app.use(cors( { origin: process.env.FRONTEND_URL || "http://localhost:5173" , credentials: true } ));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use("/api/text", textRoutes);
app.use("/api/image", imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
