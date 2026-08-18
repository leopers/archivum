# Archivum

My personal learning archive: notes, essays, projects, and music writing at the intersection of applied mathematics and computation.

The site is built with [Astro](https://astro.build/) and TypeScript. Content is written in Markdown and MDX, with KaTeX for mathematical notation and Astro's Shiki integration for syntax highlighting. The interface is available in English and French.

## Local development

Requires a current LTS release of Node.js.

```sh
npm install
npm run dev
```

The development site is available at `http://localhost:4321`.

## Useful commands

```sh
npm run dev          # Start the local development server
npm run build        # Type-check and build the production site
npm run preview      # Preview the production build
npm run format       # Format the project with Prettier
npm run format:check # Check formatting without changing files
```

## Content

- `src/content/writing` contains technical notes and essays.
- `src/content/projects` contains project pages.
- `src/content/music` contains writing about music.
- `src/i18n/ui.ts` contains English and French interface copy.

New entries are added as `.md` or `.mdx` files with frontmatter matching the schemas in `src/content.config.ts`.
