# UI / UX Wireframes

## 1. User Journey

1. User lands on a polished landing page.
2. User sees the product pitch and clicks `Start Analysis`.
3. User uploads a resume file.
4. User pastes a target job description.
5. User clicks `Analyze Resume`.
6. A motion-based loading overlay explains what the system is doing.
7. Dashboard appears with ATS score, matched skills, missing skills, extracted profile, and suggestions.

## 2. Low-Fidelity Wireframes

### Landing Page

```text
+--------------------------------------------------------------+
|  AI Resume Analyzer                                          |
|  "Get ATS score, missing skills, and suggestions instantly"  |
|                  [ Start Analysis ]                          |
|                                                              |
|  [ATS 84%] [Matched Skills] [Missing Skills] preview cards   |
+--------------------------------------------------------------+
```

### Upload + JD Section

```text
+-----------------------------+  +-----------------------------+
| Upload Resume               |  | Job Description             |
| [ Drag & Drop Area ]        |  | [ Large Textarea          ] |
| PDF / DOCX / TXT            |  | [ Analyze Resume Button ]  |
+-----------------------------+  +-----------------------------+
```

### Loading Screen

```text
+--------------------------------------------------------------+
|                     Animated circular orb                    |
|                     Analyzing Resume...                      |
|    extracting text -> matching skills -> computing ATS       |
+--------------------------------------------------------------+
```

### Results Dashboard

```text
+----------------------------+  +-----------------------------+
| ATS Score                  |  | Matched Skills              |
| 84 / 100                   |  | python, fastapi, sql        |
| progress bar               |  +-----------------------------+
+----------------------------+  | Missing Skills              |
| Candidate Profile          |  | docker, aws, ci/cd          |
| name, email, phone         |  +-----------------------------+
+----------------------------+  +-----------------------------+
| Suggestions                                             |
| - Add quantified project impact                         |
| - Include AWS deployment keywords                       |
+---------------------------------------------------------+
```

## 3. High-Fidelity Design Suggestions

### Visual Direction

- Theme: futuristic hiring intelligence dashboard
- Mood: premium, technical, polished
- Layout: rounded cards, layered gradients, dark glassmorphism

### Color Palette

- Background: `#07111f`
- Primary accent: `#6ee7f9`
- Secondary accent: `#c7f36b`
- Highlight accent: `#ff8a65`
- Text primary: `#ffffff`
- Text secondary: `#d7e5f5`

### Typography

- Headings: `Sora`
- Body: `Manrope`

### Motion

- Hero content fades upward on load
- Cards reveal in stagger
- Circular loading animation rotates continuously
- Results dashboard slides upward after analysis

## 4. Figma Wireframe Guidance

If you want to create the screens in Figma, use these frames:

1. `Landing Page - Desktop 1440`
2. `Analyzer Form - Desktop 1440`
3. `Loading Modal`
4. `Results Dashboard - Desktop 1440`
5. `Mobile Responsive - 390`

Suggested Figma setup:

- 8px spacing system
- color styles for `ink`, `aqua`, `lime`, `coral`
- text styles for `Display XL`, `Heading M`, `Body`, `Caption`
- components for pill tags, cards, buttons, progress bars

## 5. UX Improvements Included

- inline validation for empty file/JD
- drag-and-drop state feedback during upload
- clear supported file types
- persistent CTA above the fold
- animated loading feedback
- concise error messaging if parsing fails
- reusable result cards for clean live demo storytelling

## 6. Suggested Figma High-Fidelity Spec

### Landing Page

- Use a dark mesh gradient background with floating highlight glows.
- Place the main headline on the left and a fake analytics preview card on the right.
- CTA button should scroll to the analyzer form.

### Analyzer Section

- Two-column desktop layout:
  - left: upload card
  - right: job description card
- Stack them vertically on mobile with generous spacing.

### Loading State

- Centered modal with rotating orbital ring.
- Add 3 to 4 animated progress tasks so the user feels active processing.

### Results Dashboard

- First row: ATS score card plus matched/missing skills cards.
- Second row: score breakdown metrics for keyword coverage, formatting, impact.
- Third row: candidate profile and AI suggestions.
- Fourth row: experience highlights and resume excerpt.

## 7. Demo Pitch Tips

- Start the demo from the landing hero so the interface feels premium immediately.
- Use a resume and JD that produce both matched and missing skills; that makes the dashboard more impressive.
- Mention that the app works in two modes:
  - LLM-powered structured analysis
  - free fallback heuristic analysis for reliability
