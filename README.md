# Bikolpo — Alternative Civic Tech Platform (Next.js)

**Bikolpo** (বিকল্প, "alternative") is a civic tech web platform built with **Next.js** and **React** that helps people discover alternative products and services. It pairs a fast, server-rendered frontend with Next.js API routes, instant fuzzy search powered by Fuse.js, and a clean Tailwind CSS + daisyUI interface.

## Features

- **Product discovery** — a dedicated products page for browsing alternative products and services
- **Fuzzy search** — fast, typo-tolerant search with Fuse.js and debounced input for a responsive feel
- **Full-stack Next.js architecture** — pages router frontend with built-in API routes under `pages/api`, fetching data with Axios
- **Responsive UI** — Tailwind CSS utility styling with daisyUI components for a consistent, accessible design
- **Analytics built in** — Vercel Analytics integration for tracking usage
- **SEO-friendly rendering** — server-rendered pages from Next.js for fast first loads and discoverability

## Tech Stack

- **Framework:** Next.js 14 + React 18
- **Language:** JavaScript
- **Search & Data:** Fuse.js, Axios, Vercel Analytics
- **Styling:** Tailwind CSS 3 + daisyUI

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

---

⭐ If you find this project useful, consider giving it a star — contributions and feedback are welcome!
