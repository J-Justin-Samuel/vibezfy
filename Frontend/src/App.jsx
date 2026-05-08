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
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        gap: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: 36,
            height: 36,
            background: "#6c63ff",
            borderRadius: "0.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(108,99,255,0.5)",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>🎵</span>
        </div>
        <span
          style={{
            fontFamily: "Clash Display, sans-serif",
            fontSize: "1.75rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Vibezfy
        </span>
      </div>
      <div
        style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 32 }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="waveform-bar"
            style={{ height: 24, animationDelay: `${i * 0.1}s` }}
          />
        ))}
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
