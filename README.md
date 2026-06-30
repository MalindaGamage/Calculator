# Scientific Calculator

A full-stack scientific calculator application with a **Java Spring Boot** backend and a **React** frontend.

---

## Table of Contents

- [Functional Requirements](#functional-requirements)
- [Non-Functional Requirements](#non-functional-requirements)
- [Software Architecture](#software-architecture)
- [Add Operation — Sequence Diagram](#add-operation--sequence-diagram)
- [Best Practices](#best-practices)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)

---

## Functional Requirements

### Basic Arithmetic
- Addition, subtraction, multiplication, division
- Modulus / remainder operation
- Negation (sign toggle)
- Decimal point support

### Scientific Operations
- Trigonometric functions: `sin`, `cos`, `tan` (and their inverses: `asin`, `acos`, `atan`)
- Hyperbolic functions: `sinh`, `cosh`, `tanh`
- Logarithmic functions: `log` (base 10), `ln` (natural log)
- Exponential: `eˣ`, `10ˣ`
- Power: `xʸ`, `x²`, `x³`
- Roots: square root (`√`), cube root, nth root
- Absolute value: `|x|`
- Factorial: `n!`
- Constants: π (pi), e (Euler's number)

### Memory Operations
- Memory Store (`MS`), Memory Recall (`MR`), Memory Clear (`MC`), Memory Add (`M+`), Memory Subtract (`M-`)

### Angle Mode
- Toggle between **Degrees** and **Radians** for trigonometric functions

### History
- Maintain a session-based calculation history (last 20 expressions)
- Ability to clear history

### Expression Handling
- Full expression input with proper operator precedence
- Parentheses support: `(`, `)`
- Error display for invalid expressions (e.g., division by zero, domain errors)
- Keyboard input support

---

## Non-Functional Requirements

### Performance
- API response time < 100 ms for all calculation requests
- Frontend renders without perceptible lag for up to 1000 history entries
- The UI must feel instantaneous for basic operations (debounce or optimistic updates)

### Scalability
- Backend stateless design; horizontally scalable behind a load balancer
- History stored per-session (server-side session or JWT); no shared mutable state between users

### Reliability & Availability
- Backend handles malformed expressions gracefully and always returns a structured error response (never a 500 with an unhandled stack trace exposed to the client)
- Input sanitization prevents injection of arbitrary code through the expression engine

### Security
- All API endpoints use HTTPS in production
- Expression evaluation performed server-side only — never `eval()` on the client
- CORS configured to allow only the known frontend origin
- Input length limit enforced (max 500 characters per expression)

### Usability
- Responsive UI supporting desktop, tablet, and mobile screen sizes
- Keyboard shortcuts for all operations
- Clear visual feedback for errors and loading states
- Accessible (WCAG 2.1 AA): proper ARIA labels, focus management, sufficient color contrast

### Maintainability
- Backend test coverage ≥ 80% (unit + integration)
- Frontend component tests with React Testing Library
- All public APIs documented via OpenAPI (Swagger UI available at `/swagger-ui.html`)

### Compatibility
- Frontend: latest two major versions of Chrome, Firefox, Edge, Safari
- Backend: Java 17+, Spring Boot 3.x

---

## Software Architecture

### Overview

```
┌─────────────────────────────────────────────────────┐
│                     Browser                         │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │          React Frontend (SPA)               │   │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │
│   │  │Calculator│  │ History  │  │  Config  │  │   │
│   │  │   UI     │  │  Panel   │  │  Panel   │  │   │
│   │  └──────────┘  └──────────┘  └──────────┘  │   │
│   │         │             │                     │   │
│   │   ┌─────┴─────────────┘                     │   │
│   │   │    API Service Layer (Axios)             │   │
│   └───┼─────────────────────────────────────────┘   │
│       │ HTTP/JSON (REST)                             │
└───────┼─────────────────────────────────────────────┘
        │
┌───────▼─────────────────────────────────────────────┐
│              Spring Boot Backend                    │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │              REST Controller Layer            │   │
│  │   POST /api/calculate   GET /api/history      │   │
│  └──────────────────┬───────────────────────────┘   │
│                     │                               │
│  ┌──────────────────▼───────────────────────────┐   │
│  │              Service Layer                    │   │
│  │   CalculatorService   HistoryService          │   │
│  └──────────────────┬───────────────────────────┘   │
│                     │                               │
│  ┌──────────────────▼───────────────────────────┐   │
│  │           Expression Engine                   │   │
│  │   (exp4j / custom parser + evaluator)         │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │        In-Memory Store (session history)      │   │
│  │        (ConcurrentHashMap / H2 for dev)       │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Frontend Architecture

| Layer | Technology | Purpose |
|---|---|---|
| UI Framework | React 18 + TypeScript | Component-based UI |
| State Management | Zustand | Lightweight global state (current expression, history, mode) |
| API Client | Axios | HTTP requests to the backend |
| Styling | Tailwind CSS | Utility-first responsive design |
| Routing | React Router v6 | (future: multi-page) |
| Testing | Vitest + React Testing Library | Unit and component tests |
| Build | Vite | Fast dev server and production build |

**Key Components:**
- `CalculatorDisplay` — shows the current expression and result
- `ButtonPad` — renders all calculator buttons, dispatches actions
- `HistoryPanel` — lists recent calculations, clickable to restore
- `useCalculatorStore` (Zustand store) — holds expression, result, history, angle mode, memory
- `calculatorApi` — Axios wrapper for all backend calls

### Backend Architecture

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Spring Boot 3 (Java 17) | Application container and DI |
| REST API | Spring MVC | Controller + request/response mapping |
| Expression Engine | exp4j | Safe mathematical expression parsing & evaluation |
| Validation | Jakarta Bean Validation | Request DTO validation |
| Documentation | SpringDoc OpenAPI 3 | Auto-generated Swagger UI |
| Testing | JUnit 5 + Mockito | Unit and integration tests |
| Build | Maven | Dependency management and packaging |

**Package Structure:**
```
com.calculator
├── controller
│   └── CalculatorController.java
├── service
│   ├── CalculatorService.java
│   └── HistoryService.java
├── engine
│   └── ExpressionEvaluator.java
├── model
│   ├── CalculationRequest.java
│   └── CalculationResponse.java
└── exception
    └── GlobalExceptionHandler.java
```

### API Contract

#### `POST /api/calculate`
**Request:**
```json
{
  "expression": "sin(45) + sqrt(16)",
  "angleMode": "DEGREES"
}
```
**Response (success):**
```json
{
  "result": 4.7071,
  "expression": "sin(45) + sqrt(16)",
  "timestamp": "2026-06-30T10:00:00Z"
}
```
**Response (error):**
```json
{
  "error": "Division by zero",
  "expression": "5 / 0"
}
```

#### `GET /api/history`
**Response:**
```json
[
  { "expression": "sin(45) + sqrt(16)", "result": 4.7071, "timestamp": "..." },
  ...
]
```

#### `DELETE /api/history`
Clears the session history. Returns `204 No Content`.

---

## Add Operation — Sequence Diagram

The diagram below traces a full **3 + 5 = 8** calculation from button press to displayed result, across all layers of the stack.

### Phases

| Phase | Participants | What happens |
|---|---|---|
| **1 — Input accumulation** | User → ButtonPad → Zustand Store | Each button click (`3`, `+`, `5`) calls `appendToExpression()`, which concatenates the character onto the `expression` string in the store. No backend is involved; `CalculatorDisplay` re-renders reactively. |
| **2 — Calculation trigger** | User → ButtonPad → Zustand Store | Pressing `=` calls `store.calculate()`. The store sets `isLoading: true` (spinner appears) and calls `calculatorApi.calculate("3+5", "DEGREES")`. |
| **3 — HTTP request** | calculatorApi (Axios) → CalculatorController → CalculatorService → ExpressionEvaluator | Axios fires `POST /api/calculate` with `{ expression: "3+5", angleMode: "DEGREES" }`. Spring's `@Valid` validates the DTO. The controller delegates to `CalculatorService`, which calls `ExpressionEvaluator.evaluate()`. exp4j parses and evaluates the expression — no trig functions are involved, so the degree→radian conversion is skipped. The result `8.0` passes the NaN/Infinity guard. The controller saves the entry to `HistoryService` and returns `HTTP 200`. |
| **4 — Response propagation** | CalculatorController → calculatorApi → Zustand Store → ButtonPad / HistoryPanel | The JSON response travels back through Axios to the store, which sets `result = "8"`, `isLoading = false`, and prepends the entry to history. `CalculatorDisplay` and `HistoryPanel` re-render automatically via Zustand subscriptions. |

### Sequence Diagram

```
User        ButtonPad      Zustand Store    calculatorApi    Controller    CalculatorService   ExpressionEvaluator
 |               |                |                |               |               |                    |
 |── click "3" ─▶|                |                |               |               |                    |
 |               |─ appendToExpression("3") ──────▶|               |               |                    |
 |               |                |  expression="3" |               |               |                    |
 |── click "+" ─▶|                |                |               |               |                    |
 |               |─ appendToExpression("+") ───────▶|              |               |                    |
 |               |                | expression="3+" |               |               |                    |
 |── click "5" ─▶|                |                |               |               |                    |
 |               |─ appendToExpression("5") ───────▶|              |               |                    |
 |               |                | expression="3+5"|               |               |                    |
 |               |                |                |               |               |                    |
 |── click "=" ─▶|                |                |               |               |                    |
 |               |── store.calculate() ───────────▶|               |               |                    |
 |               |                |─ isLoading=true |               |               |                    |
 |               |                |─ calculate("3+5","DEGREES") ───▶|               |                    |
 |               |                |                |               |               |                    |
 |               |                |  POST /api/calculate ──────────▶               |                    |
 |               |                |  { expression:"3+5", angleMode:"DEGREES" }      |                    |
 |               |                |                |  @Valid ✓     |               |                    |
 |               |                |                |  service.calculate(request) ──▶|                    |
 |               |                |                |               |── evaluate("3+5","DEGREES") ───────▶|
 |               |                |                |               |               |  ExpressionBuilder  |
 |               |                |                |               |               |  .build().evaluate()|
 |               |                |                |               |               |  → 8.0              |
 |               |                |                |               |               |  NaN/∞ check ✓      |
 |               |                |                |               |               |◀── return 8.0 ──────|
 |               |                |                |               |◀── { result:8.0, timestamp } ───────|
 |               |                |                |  historyService.add() ✓       |                    |
 |               |                |                |◀── HTTP 200 { result:8.0 } ───|                    |
 |               |                |◀── CalculationResponse ────────|               |                    |
 |               |                |─ result="8"    |               |               |                    |
 |               |                |─ isLoading=false               |               |                    |
 |               |                |─ history prepended             |               |                    |
 |               |◀── re-render (Zustand → React) ─|              |               |                    |
 |               | Display: "8"   |                |               |               |                    |
 |               | HistoryPanel: "3+5 = 8"         |               |               |                    |
```

### Key design decisions visible in this flow

- **No math on the frontend** — `ButtonPad` only builds a string; all evaluation happens in `ExpressionEvaluator` on the server using exp4j.
- **Optimistic loading state** — `isLoading: true` is set *before* the HTTP call so the UI is never frozen.
- **History written server-side** — `HistoryService.add()` is called inside the controller *after* a successful evaluation, so failed expressions are also recorded with their error message.
- **Single source of truth** — Zustand owns all state; components subscribe and re-render automatically with no prop drilling.

---

## Best Practices

### Backend
- **Stateless REST**: each request carries all required context; sessions are used only for history scoping, not authentication state
- **DTO separation**: request/response POJOs are separate from domain models — never expose internal entities directly
- **Centralized error handling**: `@ControllerAdvice` + `GlobalExceptionHandler` maps all exceptions to structured JSON responses with appropriate HTTP status codes
- **Input validation first**: validate expression length and character whitelist before passing to the expression engine
- **No `eval()` or shell execution**: use a library (exp4j) or a hand-written recursive-descent parser — never execute user input as code or shell commands
- **Logging**: use SLF4J + Logback; log at `DEBUG` for expressions, `WARN` for evaluation errors, `ERROR` for unexpected exceptions

### Frontend
- **All computation on the backend**: the React app sends the raw expression string and displays the result — no math logic in the frontend
- **Optimistic UI**: show a loading spinner on the Calculate button during the API call; never block input
- **Single source of truth**: Zustand store owns all calculator state; components are purely presentational
- **Environment variables**: API base URL stored in `.env` (e.g., `VITE_API_BASE_URL`), never hardcoded
- **Accessibility**: every button has an `aria-label`; focus is managed programmatically after result display

### General
- **Git branching**: feature branches off `main`; PRs require passing CI before merge
- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `test:` prefixes
- **No secrets in source**: use environment variables for any configuration that varies between environments
- **CI**: GitHub Actions pipeline runs backend tests (`mvn test`) and frontend tests (`npm test`) on every PR

---

## Project Structure

```
Calculator/
├── README.md
├── backend/                   # Spring Boot application
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/calculator/
│       └── test/java/com/calculator/
└── frontend/                  # React application
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── components/
        ├── store/
        ├── api/
        └── App.tsx
```

---

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 20+ and npm 9+

### Run the Backend
```bash
cd backend
mvn spring-boot:run
# API available at http://localhost:8080
# Swagger UI at http://localhost:8080/swagger-ui.html
```

### Run the Frontend
```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

### Run All Tests
```bash
# Backend
cd backend && mvn test

# Frontend
cd frontend && npm test
```
