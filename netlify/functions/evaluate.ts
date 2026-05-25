import { Buffer } from "node:buffer";
import { clampScore, speedScore } from "../../src/lib/scoring";
import type { ErrorType, EvaluationResult } from "../../src/lib/scoring";

type SituationPayload = {
  id: string;
  prompt: string;
  targetMeaning: string;
  acceptableAnswers: string[];
  responseTimeMs: number;
};

type ModelEvaluation = {
  meaning: number;
  grammar: number;
  naturalness: number;
  overall?: number;
  passed?: boolean;
  better_answer: string;
  feedback_en: string;
  error_type: ErrorType;
};

const jsonHeaders = {
  "Content-Type": "application/json"
};

const DEFAULT_GEMINI_EVALUATION_MODEL = "gemini-2.5-flash-lite";
const DEFAULT_GEMINI_TRANSCRIBE_MODEL = "gemini-2.5-flash-lite";
const DEFAULT_OPENAI_TRANSCRIBE_MODEL = "gpt-4o-mini-transcribe";

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const formData = await request.formData();
    const audio = formData.get("audio");
    const rawSituation = formData.get("situation");

    if (!(audio instanceof Blob) || typeof rawSituation !== "string") {
      return json({ error: "Missing audio or situation payload." }, 400);
    }

    const situation = JSON.parse(rawSituation) as SituationPayload;
    const transcript = await transcribeAudio(audio);
    const speed = speedScore(situation.responseTimeMs);
    const provider = (process.env.EVALUATOR_PROVIDER ?? "gemini").toLowerCase();
    const evaluation =
      provider === "ollama"
        ? await evaluateWithOllama(situation, transcript, speed)
        : await evaluateWithGemini(situation, transcript, speed);

    const result = normalizeEvaluation(evaluation, transcript, speed);
    return json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Evaluation failed.";
    return json({ error: message }, 500);
  }
}

async function transcribeAudio(audio: Blob) {
  const provider = (process.env.TRANSCRIBE_PROVIDER ?? "gemini").toLowerCase();
  if (provider === "openai") {
    return transcribeWithOpenAI(audio);
  }

  return transcribeWithGemini(audio);
}

async function transcribeWithOpenAI(audio: Blob) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. Set TRANSCRIBE_PROVIDER=gemini to use Gemini only.");
  }

  const model = process.env.OPENAI_TRANSCRIBE_MODEL ?? DEFAULT_OPENAI_TRANSCRIBE_MODEL;
  const body = new FormData();
  body.append("model", model);
  body.append("file", audio, getAudioFileName(audio.type));

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "OpenAI transcription failed."));
  }

  const data = (await response.json()) as { text?: string };
  const transcript = data.text?.trim();
  if (!transcript) {
    throw new Error("No speech was detected.");
  }

  return transcript;
}

async function transcribeWithGemini(audio: Blob) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const model = process.env.GEMINI_TRANSCRIBE_MODEL ?? process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_TRANSCRIBE_MODEL;
  const audioBase64 = Buffer.from(await audio.arrayBuffer()).toString("base64");
  const mimeType = audio.type || "audio/webm";
  const prompt = `Transcribe this short spoken English answer exactly.

Rules:
1. Return JSON only.
2. Keep the transcript in English.
3. If speech is unclear, return an empty transcript.
4. Do not correct grammar.

JSON schema:
{
  "transcript": string
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType,
                  data: audioBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json"
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Gemini transcription failed."));
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
  if (!text) {
    throw new Error("Gemini returned an empty transcription.");
  }

  const parsed = parseJsonObject<{ transcript?: string }>(text);
  const transcript = parsed.transcript?.trim();
  if (!transcript) {
    throw new Error("No speech was detected.");
  }

  return transcript;
}

async function evaluateWithGemini(
  situation: SituationPayload,
  transcript: string,
  speed: number
): Promise<ModelEvaluation> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const model = process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_EVALUATION_MODEL;
  const prompt = buildEvaluationPrompt(situation, transcript, speed);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.15,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Gemini evaluation failed."));
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
  if (!text) {
    throw new Error("Gemini returned an empty evaluation.");
  }

  return parseModelEvaluation(text);
}

async function evaluateWithOllama(
  situation: SituationPayload,
  transcript: string,
  speed: number
): Promise<ModelEvaluation> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL ?? "gemma3:27b";
  const prompt = buildEvaluationPrompt(situation, transcript, speed);

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: "json",
      options: {
        temperature: 0.15
      }
    })
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Ollama evaluation failed."));
  }

  const data = (await response.json()) as { response?: string };
  if (!data.response) {
    throw new Error("Ollama returned an empty evaluation.");
  }

  return parseModelEvaluation(data.response);
}

function buildEvaluationPrompt(situation: SituationPayload, transcript: string, speed: number) {
  return `You are an English speaking evaluator for an A2 learner.

Evaluate the learner's spoken answer for this situation.

Situation:
${situation.prompt}

Target meaning:
${situation.targetMeaning}

Acceptable examples:
${situation.acceptableAnswers.map((answer) => `- ${answer}`).join("\n")}

Learner transcript:
${transcript}

Response time:
${situation.responseTimeMs} ms

Programmatic speed score:
${speed}

Scoring:
- meaning: 0-100
- grammar: 0-100
- naturalness: 0-100
- overall: 0-100

Rules:
1. Do not require exact wording.
2. Reward any answer that successfully handles the situation.
3. Accept synonyms, paraphrases, different polite forms, short natural answers, and reordered word choices.
4. If the learner's sentence is understandable and achieves the target meaning, meaning should usually be 70 or higher.
5. Do not punish accents or transcription punctuation.
6. Be light about small article errors such as "a" or "the".
7. Mark wrong_meaning only when the answer would not solve the real situation.
8. Feedback must be short English only. Do not use Arabic.
9. Give one better English answer that is natural and short. It is a suggestion, not the only correct answer.
10. Return JSON only.

JSON schema:
{
  "meaning": number,
  "grammar": number,
  "naturalness": number,
  "overall": number,
  "passed": boolean,
  "better_answer": string,
  "feedback_en": string,
  "error_type": "none" | "too_slow" | "wrong_meaning" | "grammar" | "unnatural" | "unclear_audio"
}`;
}

function normalizeEvaluation(
  evaluation: ModelEvaluation,
  transcript: string,
  speed: number
): EvaluationResult {
  const meaning = clampScore(evaluation.meaning);
  const grammar = clampScore(evaluation.grammar);
  const naturalness = clampScore(evaluation.naturalness);
  const modelOverall =
    typeof evaluation.overall === "number"
      ? clampScore(evaluation.overall)
      : Math.round(meaning * 0.45 + grammar * 0.2 + naturalness * 0.2 + speed * 0.15);
  const overall = clampScore(modelOverall * 0.85 + speed * 0.15);
  const semanticallyGood = meaning >= 70 && overall >= 65;
  const passed = semanticallyGood || evaluation.passed === true;

  return {
    transcript,
    meaning,
    grammar,
    naturalness,
    speed,
    overall,
    passed,
    perfect: meaning >= 85 && speed >= 75,
    better_answer: evaluation.better_answer || "Could you say that again, please?",
    feedback_en: evaluation.feedback_en || "Try again with a shorter, clearer sentence.",
    error_type: evaluation.error_type || (speed < 50 ? "too_slow" : "none"),
    mode: "live"
  };
}

function parseModelEvaluation(text: string): ModelEvaluation {
  return parseJsonObject<ModelEvaluation>(text);
}

function parseJsonObject<T>(text: string): T {
  const cleaned = text
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();
  const jsonText = cleaned.startsWith("{") ? cleaned : cleaned.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonText) throw new Error("Model did not return JSON.");
  return JSON.parse(jsonText) as T;
}

async function getErrorMessage(response: Response, fallback: string) {
  const text = await response.text();
  if (!text) return fallback;
  try {
    const parsed = JSON.parse(text) as { error?: { message?: string }; message?: string };
    return parsed.error?.message ?? parsed.message ?? fallback;
  } catch {
    return text.slice(0, 240);
  }
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: jsonHeaders
  });
}

function getAudioFileName(type: string) {
  if (type.includes("mp4")) return "answer.mp4";
  if (type.includes("aac")) return "answer.aac";
  if (type.includes("mpeg")) return "answer.mp3";
  if (type.includes("wav")) return "answer.wav";
  return "answer.webm";
}
