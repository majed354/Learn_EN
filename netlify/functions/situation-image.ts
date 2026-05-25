import { Buffer } from "node:buffer";
import { getStore } from "@netlify/blobs";
import imagePrompts from "../../scripts/image-prompts.json";

type ImagePrompt = {
  id: string;
  prompt: string;
};

type GeminiImageResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: {
          data?: string;
          mimeType?: string;
        };
        inline_data?: {
          data?: string;
          mime_type?: string;
        };
      }>;
    };
  }>;
};

const STORE_NAME = "situation-images";
const DEFAULT_IMAGE_MODEL = "gemini-2.5-flash-image";
const prompts = imagePrompts as ImagePrompt[];

export default async function handler(request: Request) {
  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id")?.trim();
    const refresh = url.searchParams.get("refresh") === "1";
    const item = prompts.find((prompt) => prompt.id === id);

    if (!item) {
      return json({ error: "Unknown situation image." }, 404);
    }

    if (refresh && !isRefreshAuthorized(url)) {
      return json({ error: "Image refresh is not authorized." }, 401);
    }

    const store = getStore(STORE_NAME);
    const key = `${item.id}.png`;

    if (!refresh) {
      const cachedImage = await store.get(key, { type: "arrayBuffer" });
      if (cachedImage) {
        return imageResponse(cachedImage, "HIT");
      }
    }

    const image = await generateSituationImage(item.prompt);
    await store.set(key, bufferToArrayBuffer(image), {
      metadata: {
        id: item.id,
        model: process.env.GEMINI_IMAGE_MODEL || DEFAULT_IMAGE_MODEL,
        generatedAt: new Date().toISOString()
      }
    });

    return imageResponse(image, refresh ? "REFRESH" : "MISS");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image generation failed.";
    return json({ error: message }, 500);
  }
}

async function generateSituationImage(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const model = process.env.GEMINI_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;
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
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseFormat: {
            image: {
              aspectRatio: "16:9"
            }
          }
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Gemini image generation failed."));
  }

  const data = (await response.json()) as GeminiImageResponse;
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((part) => part.inlineData?.data || part.inline_data?.data);
  const base64 = imagePart?.inlineData?.data || imagePart?.inline_data?.data;

  if (!base64) {
    throw new Error("Gemini did not return an image.");
  }

  return Buffer.from(base64, "base64");
}

function isRefreshAuthorized(url: URL) {
  const token = process.env.IMAGE_REFRESH_TOKEN;
  return Boolean(token && url.searchParams.get("token") === token);
}

function imageResponse(image: ArrayBuffer | Uint8Array, cacheStatus: string) {
  const body = image instanceof ArrayBuffer ? image : bufferToArrayBuffer(Buffer.from(image));

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Content-Type": "image/png",
      "X-Image-Cache": cacheStatus
    }
  });
}

function bufferToArrayBuffer(buffer: Buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
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
  return Response.json(payload, { status });
}
