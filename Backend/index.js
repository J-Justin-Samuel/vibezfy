import "dotenv/config";
import express from "express";
import cors from "cors";
import spotifyRoutes from "./routes/spotify.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Health check
app.get("/api/health", (_, res) =>
  res.json({ status: "ok", service: "Vibezfy API" }),
);

// Routes
app.use("/api/spotify", spotifyRoutes);
app.use("/api/auth", authRoutes);

// 404
app.use((_, res) => res.status(404).json({ error: "Route not found" }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🎵 Vibezfy API running on http://localhost:${PORT}`);
});
