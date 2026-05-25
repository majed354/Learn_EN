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
- OpenAI speech-to-text: `gpt-4o-mini-transcribe`
- Gemini evaluation: `gemini-2.5-flash-lite`
- Browser SpeechSynthesis for playback
- `localStorage` progress for the MVP

## Local Setup

```bash
npm install
cp .env.example .env
```

Add your keys to `.env`:

```text
OPENAI_API_KEY=...
GEMINI_API_KEY=...
OPENAI_TRANSCRIBE_MODEL=gpt-4o-mini-transcribe
GEMINI_MODEL=gemini-2.5-flash-lite
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

## Flexible Answers

Answers are evaluated by target meaning, not exact wording. Synonyms, paraphrases, shorter natural answers, and different polite forms should pass when they solve the situation.

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
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
   - `OPENAI_TRANSCRIBE_MODEL`
   - `GEMINI_MODEL`
   - `EVALUATOR_PROVIDER=gemini`

## Next Steps

- Replace SVG scenes with richer photos or short clips.
- Add 100 to 300 situations.
- Add role-play mode.
- Add Supabase accounts after the training loop feels useful.
