import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForToken } from "../utils/spotify";
import { useSpotify } from "../contexts/SpotifyContext";

export default function CallbackPage() {
  const navigate = useNavigate();
  const { setIsConnected } = useSpotify();
  const [status, setStatus] = useState("INITIALIZING_HANDSHAKE...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      setIsError(true);
      setStatus("ACCESS_DENIED_BY_USER");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    if (!code) {
      navigate("/");
      return;
    }

    setStatus("EXCHANGING_OAUTH_TOKEN...");

    exchangeCodeForToken(code)
      .then(() => {
        setIsConnected(true);
        setStatus("CONNECTION_SECURE_LOADING_VIBE");
        setTimeout(() => navigate("/"), 1000);
      })
      .catch(() => {
        setIsError(true);
        setStatus("TOKEN_EXCHANGE_FAILURE");
        setTimeout(() => navigate("/"), 2000);
      });
  }, [navigate, setIsConnected]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0EBE0] p-6 font-sans overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none font-black text-[15vw] leading-none break-all uppercase">
        AUTH_HANDSHAKE_AUTH_HANDSHAKE_
      </div>

      <div className="w-full max-w-md relative z-10">
        <div
          className={`brutal-card ${isError ? "bg-red-400" : "bg-white"} p-8 transition-colors duration-300`}
        >
          {/* HEADER */}
          <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">
              Spotify_Sync
            </h1>
            <div
              className={`w-4 h-4 brutal-border ${isError ? "bg-black" : "bg-green-400 animate-pulse"}`}
            />
          </div>

          {/* STATUS TERMINAL */}
          <div className="bg-black text-green-400 font-mono p-4 brutal-border mb-6 text-sm overflow-hidden">
            <div className="flex gap-2">
              <span className="text-white opacity-50">{">"}</span>
              <span className="break-all">{status}</span>
            </div>
            {!isError && (
              <div className="mt-2 h-1 bg-green-900/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-400 w-1/3 animate-[loading_1.5s_infinite]" />
              </div>
            )}
          </div>

          {/* METADATA */}
          <div className="flex flex-col gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <div className="flex justify-between">
              <span>Protocol:</span>
              <span className="text-black">OAuth_2.0</span>
            </div>
            <div className="flex justify-between">
              <span>Security:</span>
              <span className="text-black">Encrypted_AES</span>
            </div>
          </div>
        </div>

        {/* BOTTOM TAG */}
        <div className="mt-6 flex justify-center">
          <span className="bg-black text-white px-4 py-1 font-black text-xs brutal-border -rotate-1 shadow-[4px_4px_0px_0px_rgba(108,99,255,1)]">
            {isError ? "SYSTEM_FAILURE_0x04" : "AUTHORIZING_SESSION..."}
          </span>
        </div>
      </div>
    </div>
  );
}
