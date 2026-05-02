import * as faceapi from "face-api.js";

// face-api.js models are loaded from jsDelivr CDN
const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";

let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return;
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ]);
  modelsLoaded = true;
}

/**
 * Detect the dominant mood from a video element
 * @param {HTMLVideoElement} videoEl
 * @returns {Promise<{ mood: string, confidence: number, all: object } | null>}
 */
export async function detectMood(videoEl) {
  if (!modelsLoaded) await loadModels();

  const detection = await faceapi
    .detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  if (!detection) return null;

  const expressions = detection.expressions;
  // Returns: { neutral, happy, sad, angry, fearful, disgusted, surprised }
  const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
  const [mood, confidence] = sorted[0];

  return { mood, confidence, all: expressions };
}

// Map face-api expression to emoji + label
export const MOOD_META = {
  happy: {
    emoji: "😊",
    label: "Happy",
    color: "#fbbf24",
    playlist: "happy upbeat",
  },
  sad: {
    emoji: "😢",
    label: "Sad",
    color: "#60a5fa",
    playlist: "sad melancholy",
  },
  angry: {
    emoji: "😠",
    label: "Angry",
    color: "#f87171",
    playlist: "angry intense",
  },
  surprised: {
    emoji: "😲",
    label: "Surprised",
    color: "#a78bfa",
    playlist: "party energetic",
  },
  fearful: {
    emoji: "😨",
    label: "Fearful",
    color: "#34d399",
    playlist: "calm ambient",
  },
  disgusted: {
    emoji: "🤢",
    label: "Disgusted",
    color: "#6ee7b7",
    playlist: "chill relaxed",
  },
  neutral: {
    emoji: "😐",
    label: "Neutral",
    color: "#94a3b8",
    playlist: "top hits today",
  },
};

export function getMoodMeta(mood) {
  return MOOD_META[mood] || MOOD_META.neutral;
}
