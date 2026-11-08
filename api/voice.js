/* =====================================================================
   EL AMIR PALACE · voice for the chat assistant (Vercel serverless function)
   POST /api/voice
     { action: "tts", text, lang }              → audio/pcm stream (16-bit mono, rate in X-Sample-Rate): the reply read aloud
     { action: "stt", audio: base64 WAV, lang } → { text } (what the visitor said)
   The widget records plain 16 kHz mono WAV, a format Gemini always accepts.
   Needs GEMINI_API_KEY (same as /api/chat). Optional: GEMINI_TTS_MODEL, GEMINI_TTS_VOICE.
   ===================================================================== */
const TTS_MODEL = process.env.GEMINI_TTS_MODEL || "gemini-3.8-flash-lite-tts";
const STT_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const VOICE = process.env.GEMINI_TTS_VOICE || "Kore";
const MAX_TEXT = 900;              // characters read aloud per reply
const MAX_AUDIO = 2_000_000;       // base64 characters (~45 s of 16 kHz WAV)
const RATE = { windowMs: 60_000, max: Number(process.env.VOICE_RATE_MAX) || 20 };
const API = "https://generativelanguage.googleapis.com/v1beta/models/";

const hits = new Map();
function limited(ip) {
  const now = Date.now(), h = (hits.get(ip) || []).filter((t) => now - t < RATE.windowMs);
  h.push(now); hits.set(ip, h);
  if (hits.size > 5000) hits.clear();
  return h.length > RATE.max;
}
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const o = new URL(origin).host, host = req.headers["x-forwarded-host"] || req.headers.host;
    return o === host || /(^|\.)elamirpalace\.(com|online)$/.test(o) || /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(o);
  } catch { return false; }
}

async function gemini(model, body, ms) {
  const r = await fetch(API + encodeURIComponent(model) + ":generateContent", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(ms),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error("Gemini " + r.status), { status: r.status, data });
  return data;
}

/* what is read aloud: the reply without links, emojis, bullets or the order-card marker */
function speakable(text) {
  return String(text || "")
    .split("\u001e")[0]
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*/g, "") // markdown links / bold: read the words only
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
    .replace(/[•·]/g, ",").replace(/\s×\s/g, " ")
    .replace(/[ \t]+/g, " ").replace(/\s*\n+\s*/g, ". ").replace(/\.\s*\./g, ".")
    .trim().slice(0, MAX_TEXT);
}

const HINTS = "shawarma, shawarma especial, súper especial, mixto, pollo, carne, hummus, mutabal, muhammara, labne, tabbule, fattoush, falafel, kibbe, kibbe frito, tabaquitos, makanek, basterma, bandeja árabe, plato mixto, brochetas, kafta, lomito, parrilla mixta, fatte, sin cebolla, sin tomate, limonada con hierbabuena, batido, en agua, en leche, Lechería, Puerto La Cruz, Barcelona, Guanta, delivery, pickup";

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  if (!sameOrigin(req)) return res.status(403).json({ error: "Forbidden" });
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
  if (limited(ip)) return res.status(429).json({ error: "Too many requests" });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: "Voice is not configured." });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Bad request" });
  const lang = ["es", "en", "ar"].includes(body.lang) ? body.lang : "es";
  const t0 = Date.now();

  try {
    if (body.action === "tts") {
      // streamed: raw 16-bit mono PCM (24 kHz) goes out as Gemini makes it, so the widget starts playing in ~1 s.
      // (No style instructions in the text: the TTS model reads them aloud.)
      const text = speakable(body.text);
      if (!text) return res.status(400).json({ error: "Nothing to read." });
      const r = await fetch(API + encodeURIComponent(TTS_MODEL) + ":streamGenerateContent?alt=sse", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
        body: JSON.stringify({ contents: [{ parts: [{ text }] }], generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } } } }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!r.ok) { const data = await r.json().catch(() => ({})); throw Object.assign(new Error("Gemini " + r.status), { status: r.status, data }); }
      let first = 0, bytes = 0, rate = 24000, buf = "";
      const dec = new TextDecoder();
      const handle = (line) => {
        line = line.trim(); if (!line.startsWith("data:")) return;
        let j; try { j = JSON.parse(line.slice(5)); } catch { return; }
        for (const p of j.candidates?.[0]?.content?.parts || []) {
          if (!p.inlineData?.data) continue;
          if (!first) {
            first = Date.now() - t0;
            rate = Number((/rate=(\d+)/.exec(p.inlineData.mimeType || "") || [])[1]) || 24000;
            res.statusCode = 200;
            res.setHeader("Content-Type", "audio/pcm");
            res.setHeader("X-Sample-Rate", String(rate));
            res.setHeader("Cache-Control", "no-cache, no-transform");
          }
          const pcm = Buffer.from(p.inlineData.data, "base64"); bytes += pcm.length; res.write(pcm);
        }
      };
      for await (const chunk of r.body) {
        buf += dec.decode(chunk, { stream: true }); let i;
        while ((i = buf.indexOf("\n")) >= 0) { handle(buf.slice(0, i)); buf = buf.slice(i + 1); }
      }
      handle(buf + dec.decode());
      if (!first) throw new Error("no audio");
      console.log(`voice: tts first ${first}ms · total ${Date.now() - t0}ms · ${text.length} chars · ${(bytes / (rate * 2)).toFixed(1)} s audio`);
      return res.end();
    }

    if (body.action === "stt") {
      const audio = typeof body.audio === "string" ? body.audio : "";
      if (!audio || audio.length > MAX_AUDIO || !/^[A-Za-z0-9+/=]+$/.test(audio.slice(0, 200))) return res.status(400).json({ error: "Bad audio." });
      const data = await gemini(STT_MODEL, {
        contents: [{ role: "user", parts: [
          { inlineData: { mimeType: "audio/wav", data: audio } },
          { text: `Transcribe exactly what the customer says in this audio, in the language they speak (Spanish, English or Arabic). It is a customer of a Lebanese restaurant in Venezuela; words they may use: ${HINTS}. Write numbers as digits. Return only the transcript, no quotes, no comments. If there is no clear speech, return nothing.` },
        ] }],
        generationConfig: { temperature: 0, maxOutputTokens: 300, thinkingConfig: { thinkingLevel: "minimal" } },
      }, 20_000);
      const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim().replace(/^["“]|["”]$/g, "").slice(0, 600);
      console.log(`voice: stt ${Date.now() - t0}ms · ${(audio.length * 0.75 / 1024).toFixed(0)} KB → ${text.length} chars`);
      return res.status(200).json({ text });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    console.error(`voice: ${body.action} failed after ${Date.now() - t0}ms`, e.status || "", e.message, e.data ? JSON.stringify(e.data).slice(0, 300) : "");
    if (res.headersSent) return res.end(); // audio had started: keep what was sent
    return res.status(e.status === 429 ? 429 : 502).json({ error: "Voice unavailable right now." });
  }
};
