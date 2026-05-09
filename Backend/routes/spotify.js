/**
 * Backend Spotify routes
 *
 * These handle server-side Spotify calls that need the Client Secret
 * (e.g. Client Credentials token for non-user searches).
 * User-specific calls (play, pause, etc.) happen directly from the
 * frontend using the user's PKCE access token.
 */
import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

let clientToken = null;
let clientTokenExpiry = 0;

// ── Client Credentials token (no user login needed) ─────────────────────
async function getClientToken() {
  if (clientToken && Date.now() < clientTokenExpiry) return clientToken;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
      ).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  clientToken = data.access_token;
  clientTokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return clientToken;
}

async function spotifyFetch(endpoint) {
  const token = await getClientToken();
  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Spotify ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── Routes ───────────────────────────────────────────────────────────────

// Mood-based playlist search (public, no user auth needed)
router.get("/mood-playlist", async (req, res) => {
  const { mood } = req.query;
  const MOOD_MAP = {
    happy: "happy upbeat feel good",
    sad: "sad melancholy heartbreak",
    angry: "angry rage intense workout",
    surprised: "party energy euphoric",
    fearful: "calm peaceful ambient meditation",
    disgusted: "chill laid back mellow",
    neutral: "top hits popular today",
  };
  const q = MOOD_MAP[mood] || MOOD_MAP.neutral;
  try {
    const data = await spotifyFetch(
      `/search?q=${encodeURIComponent(q)}&type=playlist&limit=5`,
    );
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Generic search proxy
router.get("/search", async (req, res) => {
  const { q, type = "track", limit = 20 } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query" });
  try {
    const data = await spotifyFetch(
      `/search?q=${encodeURIComponent(q)}&type=${type}&limit=${limit}`,
    );
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// New releases proxy
router.get("/new-releases", async (req, res) => {
  try {
    const data = await spotifyFetch("/browse/new-releases?limit=10");
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
