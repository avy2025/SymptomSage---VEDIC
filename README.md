## Symptom-Sage 🧙‍♂️

Symptom-Sage (VEDIC) is a symptom-based health assistant that combines a simple rule-based medical triage engine with a modern React chat UI.  
It is **not** a medical device and is intended **only for informational and educational purposes**.

---

## Tech Stack

- **Frontend**
  - React 18 + TypeScript
  - Vite
  - Tailwind CSS (custom Vedic gradient theme)
  - @tanstack/react-query for data fetching
  - framer-motion for subtle animations
  - lucide-react icons
  - wouter for lightweight routing

- **Backend**
  - Node.js + Express
  - Drizzle ORM + PostgreSQL
  - Shared Zod schemas and API definitions

---

## Project Structure

High-level layout:

- `client/`
  - `index.html` – Vite HTML shell
  - `src/main.tsx` – React entry point
  - `src/App.tsx` – App routing (wouter)
  - `src/pages/Home.tsx` – Landing + chat page with background/disclaimer
  - `src/components/ChatInterface.tsx` – Main chat UI (messages, examples, input)
  - `src/hooks/use-chat.ts` – Chat data hooks (session, history, send, clear)
  - `src/lib/queryClient.ts` – React Query client config
  - `src/index.css` – Tailwind setup + Vedic theme / animation

- `server/`
  - `index.ts` – Express app bootstrap & error logging
  - `routes.ts` – API routes for chat:
    - `GET /api/chat/:sessionId` – fetch history
    - `DELETE /api/chat/:sessionId` – clear history
    - `POST /api/chat` – send new message and get VEDIC response
  - `db.ts` – Drizzle DB client
  - `storage.ts` – DB storage abstraction for messages
  - `static.ts`, `vite.ts` – Frontend serving helpers

- `shared/`
  - `schema.ts` – Drizzle schema & TS types for chat messages
  - `routes.ts` – Shared API contracts (paths, methods, Zod validation)

---

## Running the App

From the project root (`Symptom-Sage/`):

1. **Install dependencies**

```bash
npm install
```

2. **Development (no database required)**

This starts Express and Vite together on the same port (default `5000`):

```bash
npm run dev
```

3. **Production build**

```bash
npm run build
npm start
```

---

## How VEDIC Works (Backend Logic)

The core triage logic lives in `server/routes.ts`:

- A small **knowledge base** (`DISEASE_DATA`) defines:
  - Key symptom buckets (fever, cough, headache, stomach pain, chest pain)
  - Common vs urgent conditions for each bucket
  - Associated sub‑symptoms and an urgency level (`low` → `critical`)
- `analyzeSymptoms(symptoms: string)`:
  - Lowercases and scans the user input for disease keywords and sub‑symptoms.
  - Assigns scores to candidate conditions and tallies urgency.
  - Returns:
    - `matchedDiseases` – a map of condition → score
    - `urgencyLevel` – `"low" | "medium" | "high" | "critical"`
- `generateVedicResponse(userInput, chatHistoryLength)`:
  - If it’s the first interaction, returns a **greeting + disclaimer**.
  - Otherwise, ranks the top conditions, computes urgency, and returns:
    - A formatted list of **possible conditions** with confidence %
    - An **urgency badge** (🚨, ⚠️, etc.)
    - Suggestive **next steps** and a **strong disclaimer**.

All messages (user + VEDIC) are stored in the DB via `storage.ts` and read back on page load to rebuild the conversation.

---

## UX Notes

- **Session management**
  - The client generates a `vedic_session_id` via `nanoid` and persists it in `localStorage`.
  - All chat history is tied to this `sessionId`.

- **Error handling**
  - History/load errors show a toast and an inline error UI with “Retry”/“Clear and start over”.
  - Message send/clear errors show descriptive toasts.

- **Safety & Disclaimer**
  - A prominent disclaimer is always shown at the bottom of the main page.
  - The response text also repeats that this is **not a diagnosis** and to seek professional help.

---

## Customization

- **Add / tweak symptom rules**
  - Edit `DISEASE_DATA` in `server/routes.ts`:
    - Add new keys (e.g. `"breathlessness"`) with `common`, `urgent`, `symptoms`, and `urgency`.
  - Adjust scoring logic in `analyzeSymptoms` if you want more/less sensitivity.

- **Change UI theme**
  - Customize CSS variables and background animation in `client/src/index.css`.
  - Tailwind classes in `Home.tsx` and `ChatInterface.tsx` control most of the look and feel.

---

## Disclaimer

Symptom-Sage / VEDIC is an **educational demo**.  
It does **not** provide medical advice, diagnosis, or treatment.  
Always consult a licensed healthcare professional for any medical concern or emergency.


