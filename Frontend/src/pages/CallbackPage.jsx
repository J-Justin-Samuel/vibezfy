import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForToken } from "../utils/spotify";
import { useSpotify } from "../contexts/SpotifyContext";

export default function CallbackPage() {
  const navigate = useNavigate();
  const { setIsConnected } = useSpotify();
  const [status, setStatus] = useState("Connecting to Spotify...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      setStatus("Spotify connection denied. Redirecting...");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    if (!code) {
      navigate("/");
      return;
    }

    exchangeCodeForToken(code)
      .then(() => {
        setIsConnected(true);
        setStatus("Connected! Loading your vibe...");
        setTimeout(() => navigate("/"), 1000);
      })
      .catch(() => {
        setStatus("Connection failed. Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      });
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#0a0a0f" }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <div
          className="vinyl-spin"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6c63ff, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#0a0a0f",
            }}
          />
        </div>
      </div>
      <p style={{ color: "#6b6b80", fontFamily: "DM Sans, sans-serif" }}>
        {status}
      </p>
    </div>
  );
}
