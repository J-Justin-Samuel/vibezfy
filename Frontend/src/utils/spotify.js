// Spotify PKCE Authorization Flow — no backend secrets needed for user auth
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI =
  import.meta.env.VITE_SPOTIFY_REDIRECT_URI || "http://localhost:5173/callback";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

// ── PKCE helpers ────────────────────────────────────────────────────────────
function generateCodeVerifier(length = 128) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => chars[b % chars.length])
    .join("");
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// ── Public API ───────────────────────────────────────────────────────────────
export async function initiateSpotifyLogin() {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  sessionStorage.setItem("spotify_code_verifier", verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: challenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

export async function exchangeCodeForToken(code) {
  const verifier = sessionStorage.getItem("spotify_code_verifier");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: verifier,
    }),
  });
  const data = await response.json();
  if (data.access_token) {
    saveTokens(data);
    return data.access_token;
  }
  throw new Error(data.error_description || "Token exchange failed");
}

export async function refreshAccessToken() {
  const refresh = localStorage.getItem("spotify_refresh_token");
  if (!refresh) return null;
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
      client_id: CLIENT_ID,
    }),
  });
  const data = await response.json();
  if (data.access_token) {
    saveTokens(data);
    return data.access_token;
  }
  return null;
}

function saveTokens(data) {
  localStorage.setItem("spotify_access_token", data.access_token);
  if (data.refresh_token)
    localStorage.setItem("spotify_refresh_token", data.refresh_token);
  const expiresAt = Date.now() + data.expires_in * 1000;
  localStorage.setItem("spotify_expires_at", expiresAt);
}

export function getAccessToken() {
  return localStorage.getItem("spotify_access_token");
}

export function isTokenExpired() {
  const expiresAt = localStorage.getItem("spotify_expires_at");
  return !expiresAt || Date.now() > parseInt(expiresAt) - 60000;
}

export function clearTokens() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_refresh_token");
  localStorage.removeItem("spotify_expires_at");
}

// ── Spotify API calls ────────────────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  let token = getAccessToken();
  if (!token || isTokenExpired()) {
    token = await refreshAccessToken();
  }
  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
  return res.json();
}

export const spotify = {
  getMe: () => apiFetch("/me"),

  search: (query, types = "track,artist,album", limit = 20) =>
    apiFetch(
      `/search?q=${encodeURIComponent(query)}&type=${types}&limit=${limit}`,
    ),

  getFeaturedPlaylists: (limit = 6) =>
    apiFetch(`/browse/featured-playlists?limit=${limit}`),

  getNewReleases: (limit = 10) =>
    apiFetch(`/browse/new-releases?limit=${limit}`),

  getRecommendations: (params) =>
    apiFetch(`/recommendations?${new URLSearchParams(params)}`),

  getPlaylist: (id) => apiFetch(`/playlists/${id}`),

  getPlaylistTracks: (id, limit = 20) =>
    apiFetch(`/playlists/${id}/tracks?limit=${limit}`),

  searchPlaylistByMood: (mood) => {
    const moodQueries = {
      happy: "happy upbeat feel good",
      sad: "sad melancholy heartbreak",
      angry: "angry rage intense",
      surprised: "party energy euphoric",
      fearful: "calm peaceful ambient",
      disgusted: "chill laid back mellow",
      neutral: "top hits popular today",
    };
    const q = moodQueries[mood] || moodQueries.neutral;
    return apiFetch(`/search?q=${encodeURIComponent(q)}&type=playlist&limit=5`);
  },

  getTopTracks: (limit = 10) =>
    apiFetch(`/me/top/tracks?limit=${limit}&time_range=short_term`),

  play: (deviceId, uris) =>
    apiFetch(`/me/player/play${deviceId ? `?device_id=${deviceId}` : ""}`, {
      method: "PUT",
      body: JSON.stringify(uris ? { uris } : {}),
    }),

  pause: () => apiFetch("/me/player/pause", { method: "PUT" }),

  next: () => apiFetch("/me/player/next", { method: "POST" }),

  previous: () => apiFetch("/me/player/previous", { method: "POST" }),

  seek: (positionMs) =>
    apiFetch(`/me/player/seek?position_ms=${positionMs}`, { method: "PUT" }),

  setVolume: (vol) =>
    apiFetch(`/me/player/volume?volume_percent=${vol}`, { method: "PUT" }),

  getCurrentPlayback: () => apiFetch("/me/player"),

  getDevices: () => apiFetch("/me/player/devices"),
};
