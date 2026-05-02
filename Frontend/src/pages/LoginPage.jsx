import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { user, loginWithGoogle, loginWithEmail, registerWithEmail } =
    useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await registerWithEmail(form.email, form.password, form.name);
      } else {
        await loginWithEmail(form.email, form.password);
      }
      navigate("/");
    } catch (err) {
      setError(
        err.message.replace("Firebase: ", "").replace(/\(auth.*\)\.?/, ""),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-vibe-bg flex relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-96 h-96 bg-vibe-accent/20 top-[-100px] right-[-100px]" />
      <div className="orb w-64 h-64 bg-purple-500/10 bottom-20 left-20" />

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-16 relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-vibe-accent rounded-2xl flex items-center justify-center shadow-lg shadow-vibe-accent/40">
              <span className="text-2xl">🎵</span>
            </div>
            <span className="font-display text-4xl font-bold text-gradient">
              Vibezfy
            </span>
          </div>

          {/* Vinyl illustration */}
          <div className="relative w-64 h-64 mx-auto mb-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-vibe-accent via-purple-700 to-vibe-bg border-4 border-vibe-border vinyl-spin">
              <div className="absolute inset-8 rounded-full bg-vibe-bg/80 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-vibe-accent" />
              </div>
              {/* Grooves */}
              {[16, 24, 32].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-white/5"
                  style={{ inset: `${i}px` }}
                />
              ))}
            </div>
            <div className="absolute inset-0 rounded-full bg-vibe-accent/10 animate-pulse-slow" />
          </div>

          <h2 className="font-display text-3xl font-bold text-vibe-text mb-4">
            Music that feels you.
          </h2>
          <p className="text-vibe-muted text-lg leading-relaxed max-w-sm">
            Point your camera, let AI read your mood, and get the perfect
            soundtrack — instantly.
          </p>

          {/* Mood pills */}
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {[
              "😊 Happy",
              "😢 Sad",
              "😠 Angry",
              "😲 Surprised",
              "😐 Neutral",
            ].map((m) => (
              <span
                key={m}
                className="px-3 py-1 rounded-full glass text-sm text-vibe-muted"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-vibe-accent rounded-xl flex items-center justify-center">
              <span className="text-xl">🎵</span>
            </div>
            <span className="font-display text-3xl font-bold text-gradient">
              Vibezfy
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-vibe-text mb-2">
            {isRegister ? "Create account" : "Welcome back"}
          </h1>
          <p className="text-vibe-muted mb-8">
            {isRegister
              ? "Start your vibe-driven music journey"
              : "Your soundtrack is waiting"}
          </p>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl glass border border-vibe-border hover:border-vibe-accent/40 transition-all duration-200 mb-6 font-body font-medium text-vibe-text"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-vibe-border" />
            <span className="text-vibe-muted text-sm">or</span>
            <div className="flex-1 h-px bg-vibe-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm text-vibe-muted mb-1.5 font-body">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full bg-vibe-card border border-vibe-border rounded-xl px-4 py-3 text-vibe-text placeholder-vibe-muted/50 focus:outline-none focus:border-vibe-accent transition-colors font-body"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-vibe-muted mb-1.5 font-body">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-vibe-card border border-vibe-border rounded-xl px-4 py-3 text-vibe-text placeholder-vibe-muted/50 focus:outline-none focus:border-vibe-accent transition-colors font-body"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-vibe-muted mb-1.5 font-body">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-vibe-card border border-vibe-border rounded-xl px-4 py-3 text-vibe-text placeholder-vibe-muted/50 focus:outline-none focus:border-vibe-accent transition-colors font-body"
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isRegister ? "Creating account..." : "Signing in..."}
                </span>
              ) : isRegister ? (
                "Create account"
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-vibe-muted mt-6 text-sm">
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <button
              onClick={() => {
                setIsRegister((r) => !r);
                setError("");
              }}
              className="text-vibe-accent hover:underline font-medium"
            >
              {isRegister ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
