# CRIMENET.AI — Criminal Network Analysis System
### AI-Powered Intelligence Platform for Authorized Law-Enforcement Personnel
*Smart India Hackathon (SIH) Prototype*

---

## 🏛️ Project Overview

**CRIMENET.AI** is a secure, modern, and professional law-enforcement frontend prototype engineered for intelligence officers, investigators, and crime branch analysts. 

The application facilitates multi-layered topological graph analysis, cross-case linkage discovery, and suspect intelligence synthesis—designed specifically to integrate seamlessly with National Police systems (such as CCTNS and ICJS) and graph databases (Neo4j / Amazon Neptune).

---

## 🔒 Compliance & Privacy Safeguards

As mandated for this official UI/UX prototype:
- **Zero Realistic / Personal Data**: Contains no real or fabricated civilian, suspect, or sensitive case intelligence.
- **Zero Hardcoded Credentials**: Authentication flows demonstrate two-factor officer gating without demo credentials.
- **Empty State Integrity**: All case dossiers, FIR indices, and suspect profiles cleanly display official *"No data available"* and *"No records found"* states until backend services are attached.
- **Mandatory Statutory Notice**: Embedded on all pages as required by law-enforcement digital guidelines:
  > *"This system is intended for authorized law-enforcement use only. Access to information is subject to applicable laws, departmental policies, and required permissions."*

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: React 18 (Vite-powered, ES Modules)
- **Routing**: React Router v6 (`BrowserRouter`, protected session routes, and parameter handling)
- **Iconography**: Lucide React (law-enforcement and security SVGs)
- **Styling**: Pure CSS Design System with dark navy palette (`#070F2B`, `#0C1638`, `#111E48`), high-contrast accessible elements, and responsive mobile-first grids
- **State & Session**: `AuthContext` managing simulated two-factor session lifecycle and session persistence

---

## 🧭 Page Routes & Workflow

| Step / Route | Module | Purpose |
| :--- | :--- | :--- |
| `/login` | **Officer Login** | Service badge verification, required fields validation, password visibility toggle |
| `/otp` | **OTP Verification** | 6-digit individual digit inputs, auto-advance, paste support, 60s countdown timer |
| `/dashboard` | **Home Dashboard** | Welcome banner, 5 core intelligence cards (*No data available*), global search |
| `/dashboard/search` | **Global Search** | Multi-category tabs (Active Cases, Solved, FIR, Suspect, Case ID, Officer ID) |
| `/dashboard/active-cases`| **Active Cases** | Tabular case schema with priority and type filters, "View Details" API schema modal |
| `/dashboard/solved-cases`| **Solved Cases** | Historical archive with date and outcome filters |
| `/dashboard/fir-records` | **FIR Central Repository** | Statutory FIR table with FIR number, date, and act filters |
| `/dashboard/suspect-details` | **Suspect Intelligence** | Identifier inquiry with 8 dedicated intelligence modules (all awaiting input) |
| `/dashboard/network-analysis` | **Network Analysis** | Interactive radar/graph canvas with zoom controls, relationship filters, and legend |
| `/dashboard/reports` | **Investigation Reports**| Report generation wizard across case dossiers, FIRs, and network graphs |
| `/dashboard/notifications` | **Dispatch Center** | Category-filtered operational dispatches and security alerts |
| `/dashboard/settings` | **Terminal Settings** | Officer dossier, session timeout, audit logging, and WebGL engine toggles |
| *Modal* | **Session Termination** | Confirmation dialog ensuring secure logout |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation & Launch
```bash
# 1. Clone or navigate to the repository
cd crimenet.ai

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will be accessible at:
👉 **`http://localhost:3000`**

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔌 Future Backend Integration Guide

The frontend is architected for drop-in REST and GraphQL API integration:
- Replace simulated triggers in `src/context/AuthContext.jsx` with your JWT/OAuth2 endpoint (`/api/v1/auth/login` and `/api/v1/auth/verify-otp`).
- Replace table empty states in `ActiveCasesPage.jsx`, `SolvedCasesPage.jsx`, and `FirRecordsPage.jsx` with standard `fetch()` or React Query hooks.
- Replace `NetworkCanvasPlaceholder.jsx` with D3.js, Cytoscape.js, or Vis Network connected to a Neo4j Cypher endpoint.
