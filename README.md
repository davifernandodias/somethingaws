Note: A Portuguese (Brazil) translation of this README is available at docs/README.md.

# Projeto Quiz — English README

This repository contains a Next.js-based quiz application designed to help students practice AWS Cloud topics by focusing on mistakes and adapting question selection accordingly.

## Table of Contents
- Project purpose
- Business rules (quiz logic)
- Data and file structure
- How the adaptive engine works
- Configuration and parameters
- Developer guide
- Running locally
- Adding or editing questions
- Testing and formatting
- Contributing

## Project purpose

The quiz aims to help learners practice by adapting to their mistakes. The system tracks mistakes by topic and adjusts the flow of questions to reinforce weak areas while avoiding stuck loops.

## Business rules (quiz logic)

- The core idea: the student practices based on their errors. The quiz increases exposure to topics where the student makes mistakes.
- Each question carries a `group_by_topic` and a `level_of_complexity` (1..3).
- When a user answers incorrectly, the system records the error against that topic.
- Next-question selection favors topics where the user has recent mistakes.
- If the user fails more than two questions in the same topic within a short window (configured by parameters), the engine will temporarily surface a question from a different topic to avoid overfocusing and to ensure breadth.
- `accept_two_alternatives`: some questions may allow two correct alternatives; this is controlled per-question when applicable.
- Scoring, messaging, cooldowns and selection weights are parameterized (see `store-data-config.ts` and `reducer/config-quiz-reducer.ts`).

<img width="7454" height="9027" alt="Image" src="https://github.com/user-attachments/assets/f425cb32-4625-4641-a419-c280eadce57d" />


## Data and file structure (high level)

- `data/json_questions.json` — main dataset of questions (Question shape is defined in `@types/question.d.ts`).
- `@types/question.d.ts` — TypeScript types for `Question` and `QuestionResponse`.
- `src/app/_components/` — React components used by the app (question form, initial page, etc.). See `src/app/_components/question-form.tsx` for question rendering logic.
- `service/` — services related to fetching and generating questions (`question-fetcher.service.ts`, `question-generator.service.ts`).
- `reducer/` — quiz state reducer and configuration (`config-quiz-reducer.ts`).
- `utils/` — helper utilities used by the selection and scoring logic (e.g., `question-state.utils.ts`, `draws-question-topic.ts`).
- `scripts/` — utility scripts used during development (e.g., question generation, refactoring).

## How the adaptive engine works (simplified)

1. User answers a question.
2. The app records whether the answer was correct.
3. If incorrect, the engine increments the error counter for that question's topic and logs the failed attempt in recent history.
4. The engine computes a weighted list of candidate topics. Topics with higher error counts get higher weight.
5. The candidate set of questions is filtered by difficulty (configured) and by recent exposures to avoid repetition.
6. If the same topic has more than two recent failures, apply the escape rule: force selection from a different topic to avoid negative learning loops.
7. The question is presented; repeat.

## Configuration and parameters

- `store-data-config.ts` and `reducer/config-quiz-reducer.ts` contain tunable parameters such as:
	- error window size (how many recent attempts are considered)
	- threshold for the "escape" rule (default: 2 failures)
	- weighting factors for topic prioritization
	- whether to allow two-correct alternatives for certain questions
	- scoring rules and penalty/bonus values

Modify these values to tune the learning behavior.

## Developer guide

- Types: `@types/question.d.ts` defines:
	- `QuestionResponse` (alternative, because, rep)
	- `Question` (id, title, group_by_topic, accept_two_alternatives, level_of_complexity, response[])
- Services: the question selection and generation live in `service/`.
- Reducer: quiz state and persistence logic are in `reducer/`.
- Utilities: helper functions for extracting form answers, drawing next topics, and score adjustments are in `utils/`.

Files to review when changing question behavior:
- Question fetcher: `service/question-fetcher.service.ts`
- Question generator: `service/question-generator.service.ts`
- Topic drawing and logic: `utils/draws-question-topic.ts` and `utils/question-state.utils.ts`
- State reducer: `reducer/config-quiz-reducer.ts`

## Running locally

Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Adding or editing questions

1. Edit `data/json_questions.json` following the `@types/question.d.ts` shape.
2. Each question must have exactly 4 alternatives in `response`.
3. Set `level_of_complexity` to 1, 2 or 3. Prefer levels 1–2 for Cloud Practitioner style practice.
4. The engine assumes varied positions for the correct alternative; do not always place the correct answer in the same index.
5. Use descriptive `because` text to help learners understand feedback.

Scripts to help generate or refactor questions can be found in `scripts/`.

## Testing and formatting

- Run formatting and linting per repository commands. Example:

```bash
npm run format
npm run lint
```

## Contributing

- Open issues or PRs. Describe changes to question content, parameters, or adaptive logic and include rationale for learning outcomes.

## Notes

- This README is the primary documentation in English. A Portuguese translation is available at `docs/README.md`.

---
If you want, I can:
- Replace the original `data/json_questions.json` with the refactored file I generated, keeping a backup.
- Produce a condensed developer cheat-sheet for quick tuning of parameters.
