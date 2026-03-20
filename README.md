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

## Running the App Locally

To run Symptom-Sage (VEDIC) on your local machine, follow these steps:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Database Environment**
   This project uses **PostgreSQL** with **Drizzle ORM**. You need a running PostgreSQL instance. 
   Create a `.env` file in the root directory and add your connection string:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/symptomsage
   ```

3. **Initialize the Database Schema**
   Run the following command to push the schema to your database:
   ```bash
   npm run db:push
   ```

4. **Start Development Server**
   This starts the Express backend and Vite frontend together on port `5000`:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## How VEDIC Works

The current implementation features a robust triage engine:

- **Rule-Based Analysis**: Matches input against a curated knowledge base of conditions (Fever, Cough, Chest Pain, Stomach Pain, Headaches).
- **Scoring System**: Assigns confidence scores based on symptom matches and keyword proximity.
- **Urgency Classification**: Categorizes input from `low` to `critical` using visual status icons (🚨, 🆘).
- **History Management**: Conversation history is persisted in the database, allowing for contextual follow-ups within a session.

---

## Technical Features

- **Styling**: Premium Vedic theme with dark glassmorphism and animated HSL gradients.
- **Frontend**: React 18, TanStack Query, Framer Motion, and wouter.
- **Backend**: Node.js, Express, Drizzle ORM, and PostgreSQL.
- **UI Kit**: Custom components for Buttons, Inputs, Cards, and Toast notifications.

---

## Disclaimer

Symptom-Sage (VEDIC) is an **educational health assistant** and does **not** provide medical advice, diagnosis, or treatment. Always consult a licensed healthcare professional for medical concerns.


