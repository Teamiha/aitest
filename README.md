# AI Response Repeatability Tester

A web application that tests the consistency/repeatability of OpenAI language models by generating multiple responses simultaneously with and without random seeds.

## Features

- **6 Simultaneous Responses**: Generates responses from 3 OpenAI models (gpt-4o, gpt-4o-mini, gpt-3.5-turbo), each with and without random seeds
- **Single Question Mode**: Ask individual questions using GPT-4o-mini with random seeds (uses separate API key)
- **Temperature Control**: Adjustable temperature slider (0.0 - 2.0) shared across all API calls
- **Response History**: Stores and displays previous runs in localStorage
- **Clean UI**: Responsive design with Tailwind CSS
- **Copy Functionality**: Copy individual responses with one click
- **Error Handling**: Comprehensive error handling and loading states

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── ask/route.ts         # API route for single questions
│   │   └── generate/route.ts    # API route for generating responses
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main application page
├── components/
│   ├── ResponseCard.tsx         # Component for individual responses
│   └── HistoryItem.tsx          # Component for history entries
└── lib/
    └── types.ts                 # TypeScript type definitions
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Create a `.env.local` file in the root directory:

```bash
API_KEY=your_openai_api_key_here
SECOND_API_KEY=your_second_openai_api_key_here
```

Replace the placeholders with your actual OpenAI API keys:
- `API_KEY`: Used for the 6-response repeatability tester
- `SECOND_API_KEY`: Used for single question mode

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### 6-Response Repeatability Tester
1. **Input**: Enter a prompt and adjust the temperature using the slider
2. **Generation**: Click "Generate Responses" to trigger 6 parallel API calls:
   - 3 models without seeds (deterministic)
   - 3 models with random seeds (variable)
3. **Display**: Responses are displayed in a responsive grid with clear labeling
4. **History**: All runs are saved to localStorage and displayed below

### Single Question Mode
1. **Input**: Enter a question in the single question field
2. **Generation**: Click "Ask Question" to get a response from GPT-4o-mini with a random seed
3. **Display**: Response is shown immediately below the input field

## API Details

### `/api/generate` endpoint
- Accepts POST requests with `{ prompt: string, temperature: number }`
- Makes 6 parallel OpenAI API calls using `Promise.all`
- Uses the system prompt: "Respond in no more than 10 words."
- Returns `{ responses: ResponseItem[] }`

### `/api/ask` endpoint
- Accepts POST requests with `{ question: string }`
- Makes a single OpenAI API call to GPT-4o-mini with random seed
- Uses `SECOND_API_KEY` environment variable
- Uses the system prompt: "Respond in no more than 10 words."
- Returns `{ response: string }`

## Technology Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **OpenAI API** for language model interactions
- **React Hooks** for state management

## Browser Support

Works in all modern browsers that support:
- ES2020 features
- Async/await
- localStorage
- Clipboard API (for copy functionality)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

The project includes:
- TypeScript for compile-time type checking
- ESLint for code quality
- Next.js built-in optimizations

## Security Notes

- API key is stored server-side only (in environment variables)
- All OpenAI API calls are made from the server, not the client
- No API keys are exposed to the browser

## License

This project is for educational and testing purposes. Make sure to comply with OpenAI's terms of service when using their API.
