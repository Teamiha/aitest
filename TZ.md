**Step-by-Step Instructions for Building the AI Response Repeatability Tester**

Build a web application using Next.js (App Router) with TypeScript that allows users to input a prompt (e.g., "Tell an interesting fact"), set a temperature value, and click one button to generate six responses simultaneously from three OpenAI models:

- Three responses without seed (gpt-4o, gpt-4o-mini, gpt-3.5-turbo)
- Three responses with a random seed (same models, but with OpenAI's built-in `seed` parameter set to a random integer)

Requirements:
- Use Next.js 14+ with App Router and TypeScript.
- Use Tailwind CSS for styling.
- All OpenAI API calls must be server-side (in API routes) to protect the API key.
- System prompt must include: "Respond in no more than 10 words."
- Temperature is shared across all six calls and adjustable via a slider/input in the UI (default 1.0).
- One "Generate" button triggers all six API calls in parallel.
- Display six separate clearly labeled output boxes side-by-side (or in a grid) showing model name, whether seed was used, and the response.
- Show loading states while generating.
- Store and display history of previous runs (prompt + temperature + six responses) below the main interface, persisted in localStorage (client-side is fine for a simple prototype).
- Do not show the random seed to the user.
- Use the official `openai` npm package.
- Include a field to input the OpenAI API key (stored only in server-side environment variable or prompted securely — for prototype, use env variable).

Project structure:
```
/app
  /page.tsx                → Main page
  /api/generate/route.ts   → Server-side API route for generating responses
/components
  ResponseCard.tsx         → Component for each response
  HistoryItem.tsx          → Component for history entries
/lib
  types.ts                 → Shared types
```

Key implementation details:
- Use React state for prompt, temperature, responses (array of 6), loading, and history.
- On button click, POST to /api/generate with { prompt, temperature }.
- In the API route:
  - Create OpenAI client with process.env.OPENAI_API_KEY.
  - Define the three models.
  - For each model, call chat.completions.create twice:
    - Once without seed
    - Once with seed: Math.floor(Math.random() * 1_000_000_000)
  - Run all six calls in parallel with Promise.all.
  - System message: { role: "system", content: "Respond in no more than 10 words." }
  - User message: { role: "user", content: prompt }
  - Parameters: model, messages, temperature, (seed optional)
  - Return JSON with array of objects: [{ model: string, seedUsed: boolean, response: string }]
- On client, display the six responses in a responsive grid (3 columns on desktop, 2 or 1 on mobile).
- After successful generation, add the run to history (stored in localStorage).
- Load history from localStorage on mount.

Additional nice-to-haves:
- Clear history button.
- Copy button for each response.
- Error handling (show error message if API fails).
- Responsive and clean UI with Tailwind.

Generate the full project with all necessary files, including setup instructions for env variable and running the app. Use best practices for TypeScript types, error handling, and loading states. Do not use any external state management libraries — use React hooks only.