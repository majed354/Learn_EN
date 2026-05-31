# English Reflex Trainer

MVP web app for fast spoken English practice through visual situations.

The core loop is:

1. See a visual situation.
2. Speak the right English response quickly.
3. Get a short score for meaning, grammar, naturalness, and speed.
4. Repeat weak situations until they become automatic.

The training screen avoids Arabic so the learner does not translate in their head.

## Stack

- React + Vite + TypeScript
- Netlify Functions
- Gemini speech-to-text: `gemini-2.5-flash-lite`
- Gemini evaluation: `gemini-2.5-flash-lite`
- Gemini one-time image generation: `gemini-2.5-flash-image`
- Browser SpeechSynthesis for playback
- `localStorage` progress for the MVP
- 250 flexible everyday travel and small-talk situations
- PWA metadata and a lightweight service worker for app-like mobile use

## Local Setup

```bash
npm install
cp .env.example .env
```

Add your keys to `.env`:

```text
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_TRANSCRIBE_MODEL=gemini-2.5-flash-lite
GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
TRANSCRIBE_PROVIDER=gemini
EVALUATOR_PROVIDER=gemini
```

Run the frontend only:

```bash
npm run dev
```

Run with Netlify Functions locally:

```bash
npm run netlify:dev
```

If the frontend cannot reach the function during local frontend-only development, it returns a demo evaluation so the UI can still be tested.

## Situation Images

The deployed app loads each professional image through:

```text
/.netlify/functions/situation-image?id=hotel
```

The function uses `GEMINI_API_KEY` with `gemini-2.5-flash-image`, stores the result in Netlify Blobs, and reuses the saved image on future requests. If the function fails locally or during development, the app automatically falls back to the lightweight SVG scene.

This means image generation happens once per situation on the deployed site, not every training session.

To explicitly refresh a saved image, set `IMAGE_REFRESH_TOKEN` in Netlify, then open:

```text
https://YOUR_SITE.netlify.app/.netlify/functions/situation-image?id=hotel&refresh=1&token=YOUR_TOKEN
```

Local generation is still available if you want to review and commit images manually.

Generate missing images once:

```bash
npm run images:generate
```

This command skips files that already exist. To explicitly update all generated images:

```bash
npm run images:refresh
```

To refresh one image only:

```bash
npm run images:generate -- --only=hotel --refresh
```

The image prompts are in `scripts/image-prompts.json`.

## Optional OpenAI Transcription

The default setup uses Gemini only. If you later want OpenAI for speech-to-text, set:

```text
TRANSCRIBE_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_TRANSCRIBE_MODEL=gpt-4o-mini-transcribe
```

## Optional Local Evaluator

Gemini Flash-Lite is the recommended default because it is fast and deployable on Netlify.

For local experiments only, you can use Ollama:

```text
EVALUATOR_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=gemma3:27b
```

This is not the default path for production because Netlify cannot reach a model running on your personal machine.

## Progress Rules

Each situation is tracked locally:

- `new`: never attempted
- `learning`: attempted and improving
- `weak`: repeated misses or due for quick review
- `automatic`: strong scores across 3 different days

The dashboard shows overall mastery, automatic situations, review count, success rate, and category progress.

## Training Mode

Training starts with a fixed lesson path. Each lesson mixes a small set of related situations, such as arrival, hotel stay, food and service, moving around, shopping, emergencies, and polite daily replies.

The learner can also switch to Custom training, choose a topic or all topics, choose a limited number of cues, and shuffle that set. Training recordings stop automatically based on the selected speed mode so response time stays consistent.

Feedback shows the learner's raw recognized words under `Your words`, then shows a separate `Corrected` version when grammar or wording needs cleanup. A check appears beside `Your words` only when the answer is accepted with no major grammar or naturalness issue. `Say it like this` shows three short natural alternatives so the learner can practice more than one correct response.

Progress can be saved under a learner-chosen profile name. The MVP stores profiles locally in the browser, so each browser/device keeps its own named progress until cloud accounts are added later.

## Four-Stage Content Plan

The full practical core is planned as 1,000 visual speaking situations:

- Stage 1: 250 everyday survival situations for travel, services, payment, directions, emergencies, and small talk.
- Stage 2: 250 daily life and workplace situations.
- Stage 3: 250 longer social, study, and service conversations.
- Stage 4: 250 fluency pressure tests, mixed scenarios, and role-play prompts.

The current app includes all 250 situations from Stage 1.

## Content Selection

The Stage 1 situations are based on practical A1-A2 communicative functions instead of fixed memorized translations. The set is aligned with the same kind of language priorities used by CEFR-oriented learning materials:

- immediate needs and simple everyday exchanges
- useful phrases for speaking practice
- basic phrases and expressions for simple situations
- familiar topics such as travel, food, health, services, shopping, transport, social interaction, and work
- flexible paraphrases where more than one natural answer is accepted

## Fast Test

Fast Test has two paths:

- Normal: choose the number of questions and the topic, then continue until the final cue even if there are mistakes. The app shows a final report and updates progress from evaluated answers and time misses.
- Challenge: the same quick automatic flow, but the run stops after 3 mistakes.

Each cue can use 5 or 8 seconds. The test starts with a microphone check, then shows a cue number before every image so the transition is clear.

## Flexible Answers

Answers are evaluated by target meaning, not exact wording. Synonyms, paraphrases, shorter natural answers, and different polite forms should pass when they solve the situation.

The evaluator is meaning-first: good grammar cannot rescue the score if the answer does not handle the situation. Wrong meaning is capped to a low overall score, while correct meaning with rough grammar keeps a strong meaning score and receives grammar/naturalness feedback.

Example for hotel check-in:

- `I'd like to check in, please.`
- `I have a reservation.`
- `I'm here to check in.`
- `I booked a room under Majed.`

All can be accepted if they handle the same situation.

## Netlify Deploy

1. Push this folder to `majed354/Learn_EN`.
2. In Netlify, create a new site from GitHub.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL`
   - `GEMINI_TRANSCRIBE_MODEL`
   - `GEMINI_IMAGE_MODEL`
   - `TRANSCRIBE_PROVIDER=gemini`
   - `EVALUATOR_PROVIDER=gemini`
   - `IMAGE_REFRESH_TOKEN` optional, only for manual image refresh

## Next Steps

- Generate richer situation photos and commit them when the first set looks right.
- Expand Stage 2 with daily life and workplace situations after testing Stage 1.
- Add role-play mode.
- Add Supabase accounts after the training loop feels useful.
