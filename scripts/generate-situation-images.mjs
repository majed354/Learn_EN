import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const manifestPath = path.join(__dirname, "image-prompts.json");
const args = new Set(process.argv.slice(2));
const refresh = args.has("--refresh") || args.has("-r");
const only = getArgValue("--only");

await loadDotEnv(path.join(rootDir, ".env"));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is required. Add it to .env or your shell environment.");
}

const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const selectedItems = only ? manifest.filter((item) => item.id === only) : manifest;

if (!selectedItems.length) {
  throw new Error(`No image prompt matched --only=${only}`);
}

for (const item of selectedItems) {
  const outputPath = path.join(rootDir, item.output);
  const exists = await fileExists(outputPath);

  if (exists && !refresh) {
    console.log(`skip ${item.id}: already exists`);
    continue;
  }

  console.log(`${refresh ? "refresh" : "generate"} ${item.id}...`);
  const image = await generateImage(item.prompt, model, apiKey);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, image);
  console.log(`saved ${path.relative(rootDir, outputPath)}`);
}

async function generateImage(prompt, model, apiKey) {
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
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseModalities: ["Image"],
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
    const text = await response.text();
    throw new Error(`Gemini image generation failed: ${text.slice(0, 500)}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((part) => part.inlineData?.data || part.inline_data?.data);
  const base64 = imagePart?.inlineData?.data || imagePart?.inline_data?.data;

  if (!base64) {
    throw new Error("Gemini did not return an image.");
  }

  return Buffer.from(base64, "base64");
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadDotEnv(filePath) {
  if (!(await fileExists(filePath))) return;
  const text = await readFile(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;
    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) process.env[key] = value;
  }
}

function getArgValue(name) {
  const match = process.argv.slice(2).find((arg) => arg.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : undefined;
}
