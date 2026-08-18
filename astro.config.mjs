import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://leopers.github.io/archivum",
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    routing: { prefixDefaultLocale: false },
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-light",
      themes: { light: "github-light", dark: "github-dark" },
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
