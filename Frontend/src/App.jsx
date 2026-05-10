import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SpotifyProvider } from "./contexts/SpotifyContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LogoutPage from "./pages/LogoutPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CallbackPage from "./pages/CallbackPage";

// Layout (sidebar + player)
import Layout from "./components/Layout";

// ── Loading screen ────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#F0EBE0] p-6">
      <div className="flex flex-col items-center gap-8">
        {/* LOGO - High Contrast */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center brutal-border shadow-[4px_4px_0px_0px_rgba(108,99,255,1)]">
            <span className="text-lg">🎵</span>
          </div>
          <h1 className="font-black text-3xl tracking-tighter uppercase italic">
            Vibezfy<span className="text-purple-600">.</span>
          </h1>
        </div>

        {/* FREQUENCY WAVE ANIMATION */}
        <div className="flex items-center gap-2 h-24">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-4 bg-black brutal-border"
              style={{
                animation: `brutalWave 1s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
                // Different heights to start for a natural feel
                height: `${20 + (i % 3) * 20}%`,
              }}
            />
          ))}
        </div>

        {/* STATUS TAG */}
        <div className="relative">
          <div className="absolute inset-0 bg-black brutal-border translate-x-1 translate-y-1" />
          <div className="relative bg-amber-400 brutal-border px-6 py-2">
            <span className="font-black text-sm uppercase tracking-widest animate-pulse">
              Analyzing_Frequencies...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Route guards ──────────────────────────────────────────────────────────

/** Only logged-in users. Redirects to /login if not authenticated. */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
}

/** Only logged-out users. Redirects to /home if already authenticated. */
function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/home" replace /> : children;
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <SpotifyProvider>
        <BrowserRouter>
          <Routes>
            {/*
             * PUBLIC ROUTES
             * ─────────────────────────────────────────────────
             * /            Landing page  (auto-redirects logged-in users → /home)
             * /login       Sign-in form  (auto-redirects logged-in users → /home)
             * /signup      Register form (auto-redirects logged-in users → /home)
             * /callback    Spotify OAuth redirect handler
             */}
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <SignupPage />
                </PublicOnlyRoute>
              }
            />
            <Route path="/callback" element={<CallbackPage />} />

            {/*
             * PROTECTED ROUTES
             * ─────────────────────────────────────────────────
             * /home        Main app — featured, top tracks, mood button
             * /search      Search songs / albums / playlists
             * /logout      Logout confirmation page
             */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HomePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SearchPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/logout"
              element={
                <ProtectedRoute>
                  <LogoutPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all → landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SpotifyProvider>
    </AuthProvider>
  );
}
