# Bikolpo — Alternative Civic Tech Platform (Next.js + MongoDB)

**Bikolpo** (বিকল্প, "alternative") is a civic tech web platform built with **Next.js** and **MongoDB** that helps people discover alternative products and services. It pairs a fast, server-rendered frontend with Next.js API routes and a Mongoose-powered data layer, wrapped in a clean Tailwind CSS + daisyUI interface.

## Features

- **Product discovery** — a dedicated products page for browsing alternative products and services
- **Full-stack Next.js architecture** — pages router frontend with built-in API routes under `pages/api`
- **MongoDB data layer** — Mongoose models and the native MongoDB driver for flexible, document-based storage
- **Responsive UI** — Tailwind CSS utility styling with daisyUI components for a consistent, accessible design
- **SEO-friendly rendering** — server-rendered pages from Next.js for fast first loads and discoverability

## Tech Stack

- **Framework:** Next.js 14 + React 18
- **Language:** JavaScript
- **Database:** MongoDB with Mongoose ODM
- **Styling:** Tailwind CSS 3 + daisyUI

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Make sure a MongoDB instance is available and configured for the API routes before using the data-backed pages.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

---

⭐ If you find this project useful, consider giving it a star — contributions and feedback are welcome!
