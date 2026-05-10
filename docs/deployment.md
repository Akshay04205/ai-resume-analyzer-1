# Deployment Guide

## Recommended Demo Setup

- Frontend: Vercel
- Backend: Render or Railway

This split is easy, free-tier friendly, and common for college demos.

## 0. Repo Preparation

Before deploying:

1. Push the whole project to GitHub.
2. Keep the frontend in `frontend/` and backend in `backend/`.
3. Use the included [render.yaml](/Users/bakhtiarsiddiqui/Desktop/ai%20resume%20analyzer/render.yaml) for the backend on Render.

## 1. Backend Deployment on Render

1. Push the project to GitHub.
2. In Render, create a new service from the repository.
3. Render can auto-detect the included `render.yaml`, or you can create a `Web Service` manually.
4. If you create it manually, use these settings:

```text
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

5. Add environment variables:

```text
ENABLE_HF_MODEL=false
HF_MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
OPENAI_BASE_URL=https://api.openai.com/v1
ALLOW_LLM_FALLBACK=true
FRONTEND_ORIGIN=https://your-frontend-domain.vercel.app
```

6. Deploy and copy the backend URL.

### Render Recommendation

- Set `ENABLE_HF_MODEL=false` for public free-tier deployment.
- Reason: the Hugging Face local model is heavier and can slow cold starts on Render free instances.
- Keep Hugging Face enabled locally for your personal demo machine if you want the stronger semantic matching.

## 2. Frontend Deployment on Vercel

1. Import the GitHub repository into Vercel.
2. Set the root directory to `frontend`.
3. Add environment variable:

```text
VITE_API_BASE_URL=https://your-backend.onrender.com
```

4. Framework preset: `Vite`
5. Build command:

```text
npm install && npm run build
```

6. Output directory:

```text
dist
```

### Vercel Flow Tip

- Deploy backend first.
- Copy the Render backend URL.
- Add it as `VITE_API_BASE_URL` in Vercel.
- Then redeploy the frontend.

## 3. Netlify Alternative

If you prefer Netlify for the frontend:

1. Create a new site from Git.
2. Set root directory to `frontend`.
3. Build command:

```text
npm run build
```

4. Publish directory:

```text
dist
```

5. Add:

```text
VITE_API_BASE_URL=https://your-backend-service-url
```

## 4. API Key Handling

- Never hardcode API keys in frontend code.
- Store `OPENAI_API_KEY` only on the backend platform.
- Frontend talks only to your FastAPI API.

## 5. Demo-Friendly Advice

- Keep `ALLOW_LLM_FALLBACK=true` so the app still works if the LLM call fails.
- For a recorded demo, preload one sample resume and JD for a predictable output.
- Add your deployed links to the GitHub README for easy project review.
- If you do not want to spend money on API usage, leave `OPENAI_API_KEY` empty and demo the heuristic analyzer.
- For the best visual polish, deploy frontend first and then update `FRONTEND_ORIGIN` on the backend with the exact deployed domain.
- For the most stable free public deployment, use heuristic mode on Render and keep Hugging Face for local demos.
