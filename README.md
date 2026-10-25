# Resumely — AI-Powered ATS Resume Analyzer

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.5.0-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%203.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Resumely** is an enterprise-grade, AI-driven Applicant Tracking System (ATS) resume analyzer and auditor. Powered by Google Gemini Generative AI, Resumely evaluates resumes against job descriptions, identifies skill and keyword gaps, assesses ATS parseability, scores critical sections with transparent rubrics, and offers actionable feedback to maximize interview shortlist rates.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Architecture & Data Flow](#-architecture--data-flow)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Prerequisites & Environment Configuration](#-prerequisites--environment-configuration)
- [Getting Started](#-getting-started)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [API Reference](#-api-reference)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Analysis Endpoints](#analysis-endpoints)
- [ATS Scoring Rubric & Methodology](#-ats-scoring-rubric--methodology)
- [Sample Quick Presets](#-sample-quick-presets)
- [Security & Rate Limiting](#-security--rate-limiting)
- [Scripts & Testing](#-scripts--testing)
- [License](#-license)

---

## 🚀 Key Features

- **Multi-Format Document Parsing**:
  - Direct upload support for **PDF** (`pdf-parse`), **DOCX** (`mammoth`), and **Plain Text** files (up to 5 MB).
  - Manual paste mode with real-time word and character counters.
- **Strict Grounded AI Evaluation**:
  - Powered by **Google Gemini 3.5 Flash** (with automatic failover to `gemini-3.7-flash`, `gemini-3.1-flash-lite`, and `gemini-3.6-flash`).
  - Strict JSON Schema constraints ensuring structured verdicts, numerical scores, strengths, improvement items, and keyword matrices.
  - Immune to prompt injection and adversarial resume text via delimiter isolation (`<<<RESUME>>>`).
- **Interactive ATS Dashboard**:
  - **Animated circular score gauge** (0–100) with category classification (*Exceptional Fit*, *Strong Fit*, *Moderate Fit*, *Critical Gaps*).
  - **Section-by-section breakdown** with interactive accordion view for granular evaluation notes.
  - **Interactive Action Checklist**: Check off recommended improvements interactively with live progress feedback.
  - **Keyword Matcher & Gap Finder**: Real-time filtering and search for matched vs. missing keywords with 1-click clipboard copy.
  - **Report Export**: 1-click summary copy to clipboard and native print/save to PDF styling.
- **Enterprise-Ready Backend**:
  - Secure authentication with **JWT** tokens and **bcrypt** password hashing (salt rounds: 12).
  - Optional cloud file archiving with **Cloudinary** private storage.
  - Rate limiting on API and authentication routes (`express-rate-limit`).
  - Security headers enforced via `helmet`.
  - MongoDB persistence for user profiles and complete audit history.

---

## 🏛 Architecture & Data Flow

```
[ User Browser / React 18 SPA ]
       │
       ▼ (FormData: File + Job Description)
[ Express API Gateway (:4000) ]
  ├── Helmet (Security Headers)
  ├── CORS (Origin Whitelist)
  ├── Rate Limiters (Global & Auth)
  └── Auth Middleware (JWT Verification)
       │
       ├── Document Parser (pdf-parse / mammoth)
       ├── Cloudinary Storage Service (Private Raw Upload)
       │
       ▼
[ Google Gemini Generative AI ]
  ├── System Prompt & Rubric Evaluation
  ├── Delimited Content Extraction
  └── Structured JSON Output Validation
       │
       ▼
[ MongoDB Database ]
  ├── Users Collection (Bcrypt hashes, Profile)
  └── Analyses Collection (Score, Full Breakdown, History)
       │
       ▼
[ Redux Toolkit Store -> Results Dashboard UI ]
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: [React Router DOM 7](https://reactrouter.com/)
- **Bundler & Server**: [esbuild](https://esbuild.github.io/) & [live-server](https://www.npmjs.com/package/live-server)
- **Styling**: Modern Vanilla CSS (Design Tokens, Glassmorphism, CSS Custom Properties, Responsive Layouts)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Web Framework**: [Express.js 4](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 8](https://mongoosejs.com/)
- **AI Engine**: [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai) (`@google/generative-ai`)
- **File Parsing**: `pdf-parse` (PDF extraction), `mammoth` (DOCX extraction), `multer` (in-memory file handling)
- **Cloud Assets**: [Cloudinary](https://cloudinary.com/) (Raw file private storage)
- **Security & Auth**: `jsonwebtoken`, `bcryptjs`, `helmet`, `express-rate-limit`, `cors`

---

## 📂 Project Directory Structure

```plaintext
Resumely/
├── README.md                  # Project documentation
├── backEnd/                   # Express.js REST API
│   ├── config/                # Database, Cloudinary, Security, and Env configurations
│   │   ├── cloudinary.config.js
│   │   ├── db.js              # Mongoose connection
│   │   ├── env.config.js      # Environment variable validation
│   │   └── security.config.js # Helmet and Rate Limiting policies
│   ├── controllers/           # HTTP Request & Response handlers
│   │   ├── analysis.controllers.js
│   │   └── auth.controllers.js
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.middlewares.js   # JWT validation
│   │   ├── error.middlewares.js  # Centralized error handler
│   │   └── upload.middlewares.js # Multer memory upload filter
│   ├── models/                # Mongoose database schemas
│   │   ├── analysis.models.js # Analysis report and metadata schema
│   │   └── user.models.js     # User credentials schema
│   ├── routes/                # Express API endpoints
│   │   ├── analysis.routes.js
│   │   ├── auth.routes.js
│   │   └── index.js
│   ├── services/              # Core business and external API logic
│   │   ├── analysis.services.js    # Gemini AI caller and parser
│   │   ├── auth.services.js        # JWT generation & password hashing
│   │   └── fileStorage.services.js # Cloudinary upload stream
│   ├── tests/                 # Backend automated test suite
│   ├── utils/                 # Input validation utilities
│   ├── index.js               # Application entry point
│   ├── nodemon.json           # Nodemon watcher configuration
│   └── package.json
│
└── frontEnd/                  # React 18 Single Page Application
    ├── public/
    │   ├── app.js             # esbuild compiled bundle
    │   └── index.html         # Application shell
    ├── src/
    │   ├── components/        # React UI components
    │   │   ├── Analyzer.jsx   # Input workspace & preset loader
    │   │   ├── AuthScreen.jsx # Sign In / Sign Up modal
    │   │   ├── Dashboard.jsx  # Main application wrapper and navigation
    │   │   └── Results.jsx    # Comprehensive ATS analysis results view
    │   ├── constants/         # Demo presets and sample data
    │   ├── services/          # Client API HTTP client
    │   ├── store/             # Redux store & slices
    │   │   └── slices/
    │   │       ├── analysis.slices.js
    │   │       └── auth.slices.js
    │   ├── App.jsx            # Root UI controller
    │   ├── index.js           # React root mount
    │   └── styles.css         # Global design tokens and theme
    ├── tests/                 # Frontend tests
    └── package.json
```

---

## ⚙️ Prerequisites & Environment Configuration

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)
- *(Optional)* **Cloudinary Account**: Required only if cloud file archiving is enabled.

### Environment Variables (`backEnd/.env`)

Create a `.env` file inside the `backEnd/` directory with the following variables:

```ini
# Server Configuration
PORT=4000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000,http://127.0.0.1:3000

# Database
MONGO_URI=mongodb://127.0.0.1:27017/resumely
MONGO_DATABASE=resumely

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash

# Cloudinary (Optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🛠 Getting Started

### 1. Backend Setup

1. Open a terminal and navigate to `backEnd/`:
   ```bash
   cd backEnd
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure MongoDB is running locally or your Atlas connection string is configured in `.env`.
4. Start the backend development server (with nodemon hot-reload):
   ```bash
   npm run dev
   ```
   *The API will start at `http://localhost:4000` (or your configured `PORT`).*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to `frontEnd/`:
   ```bash
   cd frontEnd
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the esbuild bundler and local development server concurrently:
   ```bash
   npm run dev
   ```
   *The frontend application will be served at `http://localhost:3000`.*

---

## 📡 API Reference

All protected endpoints require an `Authorization` header formatted as:
`Authorization: Bearer <JWT_TOKEN>`

### Authentication Endpoints

#### `POST /api/auth/signup`
Creates a new user account.
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "StrongPassword123!"
  }
  ```
- **Response** `201 Created`:
  ```json
  {
    "user": {
      "id": "673f4...",
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "token": "eyJhbGciOi..."
  }
  ```

#### `POST /api/auth/login` (or `/api/auth/signin`)
Authenticates existing user credentials and returns a session token.
- **Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "StrongPassword123!"
  }
  ```

---

### Analysis Endpoints

#### `POST /api/analyze` *(Requires Auth)*
Analyzes a resume against an optional job description.
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `resume`: *(Optional)* File upload (`.pdf`, `.docx`, `.txt` — Max 5MB)
  - `text`: *(Optional if file provided)* Raw resume text
  - `jobDescription`: *(Optional)* Target job description string
- **Response** `200 OK`:
  ```json
  {
    "analysis": {
      "score": 88,
      "verdict": "STRONG FIT",
      "summary": "Candidate exhibits strong alignment with required full stack competencies...",
      "strengths": [
        "Demonstrated production experience with Node.js microservices",
        "Clear quantifiable metrics regarding latency reductions"
      ],
      "improvements": [
        "Include explicit mention of Docker containerization strategies in deployment bullets",
        "Add certifications or relevant coursework in cloud architecture"
      ],
      "keywords": {
        "matched": ["React", "Node.js", "Express", "MongoDB", "REST APIs"],
        "missing": ["Kubernetes", "GraphQL"]
      },
      "sections": [
        { "name": "Contact & Header", "score": 95, "note": "Complete and cleanly formatted." },
        { "name": "Experience Evidence", "score": 85, "note": "Quantified outcomes present." },
        { "name": "Skills & Keywords", "score": 80, "note": "High coverage of core stack." },
        { "name": "ATS Formatting", "score": 90, "note": "Standard headings and clean flow." },
        { "name": "Job Alignment", "score": 90, "note": "Well-tailored to job description." }
      ]
    },
    "source": "gemini",
    "resumeAsset": {
      "publicId": "resumely/resumes/...",
      "url": "https://res.cloudinary.com/..."
    }
  }
  ```

#### `GET /api/analyses` *(Requires Auth)*
Retrieves the user's last 20 resume analysis summaries.

#### `GET /api/analyses/:id` *(Requires Auth)*
Retrieves a specific past analysis report, including full resume text and file metadata.

---

## 📊 ATS Scoring Rubric & Methodology

Resumely strictly adheres to an objective, grounded scoring rubric weighted across five core dimensions:

| Rubric Dimension | Weight | Description |
| :--- | :---: | :--- |
| **Experience Evidence** | **35%** | Verifies specific, quantified impact and metrics rather than passive job responsibilities. |
| **Skills & Keyword Evidence** | **30%** | Checks for technical and domain skills substantiated by actual work experience. |
| **ATS Formatting & Parseability** | **15%** | Ensures standard section titles, clear hierarchy, and absence of parser-breaking elements. |
| **Contact & Header Completeness** | **10%** | Validates reachability (name, email, phone, location, LinkedIn/GitHub links). |
| **Job Description Alignment** | **10%** | Assesses precision match against target job requirements (scored neutrally if no JD is provided). |

> [!NOTE]
> **Grounding Principle**: Resumely's AI auditor strictly bases scores on facts literally written in the resume. It never assumes or hallucinates unmentioned credentials.

---

## ⚡ Sample Quick Presets

The frontend features 1-click presets in the **Analyze Resume** view:
1. **✨ Senior Full Stack (95%+ Match)**: A complete, senior-level technical resume paired with a matching Job Description.
2. **⚠️ Entry-Level Non-Tech (Low Match)**: A non-technical assistant resume submitted for a Senior Full Stack role to demonstrate gap identification and missing keyword detection.

---

## 🛡️ Security & Rate Limiting

- **HTTP Security Headers**: Powered by `helmet` with configured cross-origin resource policy.
- **CORS Protection**: Restricted to allowed client origins.
- **API Rate Limiting**:
  - Global API: `120 requests` per 15-minute window per IP.
  - Auth Routes (`/signup`, `/login`): `10 requests` (production) or `100 requests` (development) per 15-minute window.
- **Input Sanitization**: Email normalization and length guards on all inputs.
- **Adversarial Input Defense**: Input delimiters prevent prompt injection through resume text.

---

## 🧪 Scripts & Testing

### Backend
```bash
npm run dev        # Run with nodemon file watcher
npm run start      # Run in production mode
npm run seed:demo  # Run demo seed data script (if configured)
```

### Frontend
```bash
npm run dev        # Concurrently bundle and serve the app
npm run dev:bundle # Run esbuild in watch mode
npm run dev:serve  # Run live-server on port 3000
npm run build      # Production minified bundle
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
