# Axiom Pulse – Token Discovery Dashboard (Frontend Assignment)

This project is a **pixel-perfect frontend replica of Axiom Trade’s Pulse token discovery system**, built as part of a technical assignment.  
The goal of this project is to demonstrate **UI precision, performance optimization, scalable architecture, and real-time interaction handling** using modern frontend technologies.

---

## 🔗 Live Demo
👉 https://token-trading-table02.vercel.app/pulse

---

## 🎥 Demo Video (1–2 min)
👉 https://www.youtube.com/watch?v=22R8fzzHEzU

The video demonstrates:
- Token discovery columns
- Hover, tooltip, popover, and modal interactions
- Sorting behavior
- Real-time price updates
- Responsive layout (mobile → desktop)

---

## 🧩 Features Implemented

### Core Features
- ✅ Three token discovery sections:
  - **New Pairs**
  - **Final Stretch**
  - **Migrated**
- ✅ Reusable **TokenCard system**
- ✅ Interactive UI elements:
  - Tooltips (Radix UI)
  - Popovers
  - Modals
  - Hover effects
  - Click actions
- ✅ Sorting logic (configurable per column)
- ✅ Real-time price updates using **WebSocket mock**
- ✅ Smooth price change color transitions (green/red)
- ✅ Loading states:
  - Skeleton loaders
  - Shimmer effect
  - Progressive loading
  - Error boundaries

---

## 🎨 UI Accuracy (Pixel-Perfect)

- The UI closely matches **axiom.trade/pulse**
- Spacing, typography, colors, and interactions are replicated with **≤ 2px tolerance**
- Layout verified manually using browser DevTools

---

## 📱 Responsive Design

- Fully responsive down to **320px width**
- Layout adapts across:
  - Mobile (320px)
  - Tablet (768px)
  - Desktop (1280px+)

### Snapshot (Responsive Layout)
📸 Example snapshot:

<img width="1505" height="794" alt="Screenshot 2025-12-27 at 6 28 15 PM" src="https://github.com/user-attachments/assets/82b1ce9f-9135-4353-8773-af84953c296b" />


## 🏗️ Architecture

This project follows **Atomic Design Architecture**:
atoms       → Tooltip, Badge, Skeleton, Text
molecules   → TokenHeader, TokenMetrics, PriceChange
organisms   → TokenCard, TokenColumn, PulseBoard
overlays    → Modal, Popover

### State Management
- **Redux Toolkit** → UI state (sorting, selection)
- **React Query** → Server/data fetching and caching
- **Custom Hooks** → WebSocket mock, animations

---

## ⚙️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript (strict)**
- **Tailwind CSS**
- **Redux Toolkit**
- **React Query**
- **Radix UI / shadcn**
- **Lucide Icons**

---

## ⚡ Performance Optimizations

- Memoized components (`React.memo`)
- Stable callbacks (`useCallback`)
- Fixed layout heights to avoid CLS
- Lazy loading where appropriate
- Deferred WebSocket initialization
- No layout shifts during loading

### Lighthouse Scores (Incognito Mode)
- **Performance:** 90+
- **Accessibility:** 90+
- **Best Practices:** 95+
- **SEO:** 100

---

## 🧪 Lighthouse Verification

- Tested in Chrome Incognito
- Extensions disabled
- Tested on:
  - Mobile
  - Desktop

---

## 🛠️ Setup Instructions

```bash
git clone https://github.com/Nehabhadauria19/token-trading-table.git
cd token-trading-table
npm install
npm run dev
