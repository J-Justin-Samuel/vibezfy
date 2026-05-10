import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { clearTokens } from "../utils/spotify";

export default function LogoutPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      clearTokens();
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const name = user?.displayName || user?.email?.split("@")[0] || "USER_01";
  const email = user?.email || "";

  return (
    // Changed overflow-hidden to overflow-y-auto so mobile users can scroll if the keyboard or small screen clips content
    <div className="min-h-screen flex flex-col bg-[#F0EBE0] font-sans overflow-y-auto">
      {/* HEADER / NAV */}
      <nav className="h-[70px] border-b-[4px] border-black px-4 md:px-6 flex items-center justify-between bg-white shrink-0 sticky top-0 z-50">
        <Link
          to="/home"
          className="no-underline text-black font-black text-xl md:text-2xl tracking-tighter"
        >
          VIBEZFY.
        </Link>
      </nav>

      {/* Main Container - Changed from fixed grid to flex-col on mobile, grid on desktop */}
      <main className="flex-1 flex flex-col md:grid md:grid-cols-2">
        {/* LEFT PANEL - VISUAL MESSAGE */}
        <section className="bg-red-400 p-6 md:p-8 border-b-[4px] md:border-b-0 md:border-r-[4px] border-black flex flex-col justify-center items-center">
          <div className="brutal-card bg-white p-6 md:p-8 -rotate-2 max-w-sm w-full">
            <h2 className="text-3xl md:text-5xl font-black leading-none mb-4 uppercase italic">
              EXITING <br className="hidden md:block" /> SYSTEM?
            </h2>
            <p className="font-bold text-base md:text-lg leading-tight uppercase">
              All frequencies and facial data saved. The vibe will be here when
              you return.
            </p>
          </div>
        </section>

        {/* RIGHT PANEL - CONFIRMATION BOX */}
        <section className="p-6 md:p-8 flex items-center justify-center bg-[#F0EBE0]">
          <div className="w-full max-w-md">
            <div className="brutal-card bg-white p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">
                USER_CALIBRATION:
              </h3>

              {/* USER INFO BLOCK */}
              <div className="brutal-border p-4 mb-8 bg-gray-50 flex items-center gap-4">
                {/* Avatar handling for mobile */}
                <div className="w-12 h-12 md:w-16 md:h-16 brutal-border bg-purple-500 overflow-hidden shrink-0">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-black text-xl md:text-2xl">
                      {name[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-base md:text-lg uppercase truncate leading-none mb-1">
                    {name}
                  </p>
                  <p className="font-bold text-[10px] md:text-xs text-gray-500 uppercase truncate">
                    {email}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="brutal-btn brutal-btn brutal-btn-hover bg-red-400 py-3 md:py-4 text-lg md:text-xl group relative overflow-hidden"
                >
                  <span className={loading ? "opacity-0" : "opacity-100"}>
                    {loading ? "CLEARING..." : "YES_SIGN_OUT"}
                  </span>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => navigate("/home")}
                  disabled={loading}
                  className="brutal-btn brutal-btn brutal-btn-hover bg-white py-2 md:py-3 text-xs md:text-sm"
                >
                  ABORT_LOGOUT_AND_VIBE
                </button>
              </div>
            </div>

            <p className="mt-6 text-center font-black text-[10px] uppercase tracking-widest text-gray-400 pb-8 md:pb-0">
              Session_End_Protocol_V2.6 // Secure_Exit_Ready
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
