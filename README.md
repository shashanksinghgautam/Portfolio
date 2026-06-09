# Shashank Singh Gautam - Portfolio

Modern, minimal portfolio built with **Vite + React + Tailwind CSS + Framer Motion**.

## Features

- Dark / light mode with smooth transition (system-aware, persisted)
- Hero with animated metrics and a refined identity
- Sections: About, Skills, Experience timeline, Projects, Achievements, Contact
- Scroll-progress indicator and scroll-based reveals
- Fully responsive, mobile-first
- Resume download button (drop your PDF in `public/`)
- Single source of truth for content in [`src/data/portfolio.js`](src/data/portfolio.js)

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Add your resume

Place your PDF at `public/Shashank_Resume_Py_4.pdf` (the path referenced in `portfolio.js`).
The "Download Résumé" buttons will serve it directly.

## Project structure

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── context/ThemeContext.jsx     # theme provider + hook
├── data/portfolio.js            # all content lives here
└── components/
    ├── Navbar.jsx
    ├── Hero.jsx
    ├── About.jsx
    ├── Skills.jsx
    ├── Experience.jsx
    ├── Projects.jsx
    ├── Achievements.jsx
    ├── Contact.jsx
    ├── Footer.jsx
    ├── ThemeToggle.jsx
    ├── SectionHeading.jsx
    ├── ScrollProgress.jsx
    └── BackgroundDecor.jsx
```

## Customizing

- **Content:** edit `src/data/portfolio.js`.
- **Colors / fonts:** tweak `tailwind.config.js` (the `accent` palette + `fontFamily`).
- **Animations:** Framer Motion variants live inline in each section component.

## Deploy

Works out-of-the-box on Vercel, Netlify, GitHub Pages, Cloudflare Pages, or any static host. Build command: `npm run build`. Output dir: `dist`.
