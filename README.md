# AI-Enhanced Resume Analyzer

A web-based resume analysis project that compares a candidate resume with a job description and generates ATS-style insights such as matched skills, missing skills, score breakdown, and improvement suggestions.

This project was built as a college demonstration project, with emphasis on:

- modern UI and presentation
- practical AI/NLP integration without heavy model training
- fast setup using free or low-cost tools
- easy local demo and web deployment

## Project Overview

The application allows a user to:

1. Upload a resume in `PDF`, `DOCX`, or `TXT` format
2. Paste a job description
3. Analyze resume relevance using:
   - resume text extraction
   - skill matching
   - ATS score logic
   - missing skill detection
   - suggestion generation
4. View the results inside a modern dashboard UI

## Main Features

- Resume upload with file validation
- Support for `PDF`, `DOCX`, and `TXT`
- Job description comparison
- ATS-style scoring
- Matched and missing skills detection
- Candidate profile extraction
- Resume preview extracted from parser output
- Suggestion cards for improvement
- Animated loading and polished frontend experience
- Free local semantic matching path with Hugging Face
- Heuristic fallback mode when model-based analysis is unavailable

## Tech Stack

### Frontend

- React `18.3.1`
- React DOM `18.3.1`
- Vite `5.4.8`
- Tailwind CSS `3.4.13`
- Framer Motion `11.11.9`
- Lucide React `0.453.0`
- PostCSS `8.4.47`
- Autoprefixer `10.4.20`
- `@vitejs/plugin-react` `4.3.2`

### Backend

- FastAPI `0.115.0`
- Uvicorn `0.30.6`
- Pydantic `2.9.2`
- Pydantic Settings `2.5.2`
- Python Multipart `0.0.9`
- Python Dotenv `1.0.1`

### Resume Parsing

- PyPDF2 `3.0.1`
- python-docx `1.1.2`

### AI / NLP

- OpenAI Python SDK `1.51.2`
- Sentence Transformers `3.2.1`
- Free semantic model option:
  - `sentence-transformers/all-MiniLM-L6-v2`

## How the Project Works

### User Flow

1. User opens the landing page
2. User uploads a resume
3. User pastes a job description
4. Backend extracts text from the uploaded resume
5. Backend runs one of the analysis paths:
   - Hugging Face semantic analysis
   - OpenAI prompt-based analysis
   - heuristic fallback analysis
6. Frontend displays:
   - ATS score
   - matched skills
   - missing skills
   - candidate profile
   - suggestions
   - experience highlights

### Analysis Logic

The project uses the ATS formula:

```text
ATS Score = (matched_skills / required_skills) * 100
```

It also includes supporting score metrics such as:

- keyword coverage
- formatting score
- impact score

## Project Structure

```text
ai resume analyzer/
├── api/
│   └── sample-analysis-response.json
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── models.py
│   │   └── services/
│   │       ├── analysis.py
│   │       ├── hf_analysis.py
│   │       ├── llm.py
│   │       ├── parser.py
│   │       └── profile.py
│   ├── .env.example
│   └── requirements.txt
├── docs/
│   ├── deployment.md
│   └── ui-ux-wireframes.md
├── frontend/
│   ├── index.html
│   ├── package-lock.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   └── lib/
│   ├── .env.example
│   ├── tailwind.config.js
│   └── vite.config.js
├── render.yaml
└── README.md
```

## Local Setup

### Prerequisites

- Python `3.11` recommended
- Node.js `20` to `22`
- npm

### Backend Setup

```bash
cd backend
python3.11 -m venv .venv311
.venv311/bin/pip install -r requirements.txt
.venv311/bin/uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

### Local URLs

- Frontend: [http://127.0.0.1:5173](http://127.0.0.1:5173)
- Backend docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## Environment Variables

### Backend `.env`

```env
ENABLE_HF_MODEL=true
HF_MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
OPENAI_BASE_URL=https://api.openai.com/v1
ALLOW_LLM_FALLBACK=true
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Deployment

Recommended free deployment:

- Frontend: Vercel
- Backend: Render

Important note for free hosting:

- keep `ENABLE_HF_MODEL=false` on free backend hosting if startup becomes slow
- keep `ALLOW_LLM_FALLBACK=true` for a safer public demo

Detailed deployment steps are available in:

- [docs/deployment.md](/Users/bakhtiarsiddiqui/Desktop/ai%20resume%20analyzer/docs/deployment.md)

## UI / UX Notes

The frontend uses:

- gradient hero section
- glassmorphism cards
- animated loading state
- clean result dashboard
- mobile-friendly section layout

Design and wireframe notes are available in:

- [docs/ui-ux-wireframes.md](/Users/bakhtiarsiddiqui/Desktop/ai%20resume%20analyzer/docs/ui-ux-wireframes.md)

## Sample Output

Example structured response:

- [api/sample-analysis-response.json](/Users/bakhtiarsiddiqui/Desktop/ai%20resume%20analyzer/api/sample-analysis-response.json)

## Current Limitations

- Resume name extraction can still depend on resume formatting quality
- PDF parsing quality depends on the source PDF text layer
- Hugging Face model loading may be slower on the first run
- Public free deployment may work better with fallback mode than with local model downloads

## Future Improvements

- better section-wise resume parsing
- semantic skill clustering
- downloadable PDF report
- multiple job description comparison
- admin/demo sample mode
- stronger model and logging pipeline

## Author

Built by `Bakhtiar Siddiqui`, 'Akshay Dhiman' as an AI/ML college project focused on practical resume analysis and modern product-style presentation.
