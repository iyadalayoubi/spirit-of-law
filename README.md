# روح النظام | Spirit of Law

Premium bilingual (Arabic / English) law firm website built with React + Vite.

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — build tool and dev server
- **React Router v6** — client-side routing
- **CSS Modules** — component-scoped styles (no CSS framework)
- **Google Fonts** — Noto Naskh Arabic, Cormorant Garamond, DM Sans

## Local Development

```bash
# Install dependencies
npm install

# Start dev server at http://localhost:3000
npm run dev

# Production build → dist/
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/        # Navbar, Footer
│   ├── sections/      # Hero, About, Team, Services, Contact
│   └── ui/            # Shared UI components
├── context/           # LanguageContext, LanguageProvider
├── hooks/             # useLanguage, useScrollAnimation
├── i18n/              # en.js, ar.js — all copy in one place
├── pages/             # Home, 404
├── router/            # createBrowserRouter config
└── styles/            # Global CSS variables and base styles
public/
├── images/            # Team photos, Why Us images, logo
├── logo.svg
└── favicon.svg
```

## Adding Images

Place images in `public/images/` with these names:

| File                        | Used by                           |
| --------------------------- | --------------------------------- |
| `team-1.jpg` … `team-7.jpg` | Team section cards                |
| `why-excellence.jpg`        | Why Us — Legal Excellence card    |
| `why-track-record.jpg`      | Why Us — Proven Track Record card |
| `why-availability.jpg`      | Why Us — 24/7 Availability card   |

## Deployment

Deployed automatically to GitHub Pages via GitHub Actions on every push to `main`.
See `.github/workflows/deploy.yml`.

Live URL: `https://<your-username>.github.io/<repo-name>/`
