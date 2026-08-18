export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const languageNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

export const ui = {
  en: {
    nav: {
      writing: "Writing",
      projects: "Projects",
      topics: "Topics",
      music: "Music",
      about: "About",
    },
    footer: "Built as a living notebook.",
    personalArchive: "Learning",
    homeBio1:
      "I’m Leo, a Brazilian engineering student at École Polytechnique. I’m interested in the meeting point between applied mathematics and computation—from machine learning and formal verification to electronics.",
    homeBio2:
      "I keep this site as a record of what I’m learning, building, and thinking about, with the occasional detour into music.",
    recentWriting: "Recent writing",
    allNotes: "All notes",
    projects: "Projects",
    allProjects: "All projects",
    status: {
      ongoing: "Ongoing",
      complete: "Complete",
      archived: "Archived",
    },
    writingLabel: "Writing",
    writingTitle: "Notes & essays",
    writingDesc: "Notes from my studies.",
    work: "Work",
    projectsDesc: "Code and research projects.",
    index: "Index",
    topics: "Topics",
    topicsDesc: "Notes and projects grouped by subject.",
    entries: "entries",
    entry: "entry",
    music: "Music",
    musicTitle: "Listening & writing",
    musicDesc: "Playlists and notes about music.",
    spotifyProfile: "Spotify profile",
    featuredPlaylists: "Featured playlists",
    musicWriting: "Music writing",
    musicEmpty: "Music notes will appear here.",
    about: "About",
    aboutTitle: "I’m Leo.",
    aboutIntro:
      "I’m from Brazil and currently studying engineering at École Polytechnique in France.",
    background: "Background",
    background1:
      "Before moving to France, I studied computer engineering at ITA (Instituto Tecnológico de Aeronáutica) in Brazil. That degree gave me a strong foundation in the theory of computation and hardware design, and it left me curious about the many layers between abstract ideas and the machines that bring them to life.",
    background2:
      "At École Polytechnique, I’m exploring that connection from a different angle, focusing on applied mathematics and computation. I’m especially drawn to machine learning, artificial intelligence, formal verification, and electronics—and to problems that do not fit neatly inside just one of those fields.",
    thisArchive: "This archive",
    archiveText:
      "This site is my place to work through ideas in public. I use it to collect study notes, document projects, and preserve the small insights that are easy to lose once a course or experiment is over.",
    outside: "Outside my studies",
    outsideText:
      "Music is the other constant in my life. I’m an amateur guitarist and an enthusiastic listener, moving freely between indie, progressive rock, metal, techno, trance, and whatever else catches my ear.",
    elsewhere: "Elsewhere",
    researchNote: "Writing",
    project: "Project",
    sourceCode: "Source code",
    filedUnder: "Filed under",
    englishOnly: "This article is currently available in English.",
  },
  fr: {
    nav: {
      writing: "Textes",
      projects: "Projets",
      topics: "Sujets",
      music: "Musique",
      about: "À propos",
    },
    footer: "Conçu comme un carnet vivant.",
    personalArchive: "Archives personnelles",
    homeBio1:
      "Je m’appelle Leo. Je suis un étudiant brésilien en cycle ingénieur à l’École polytechnique. Je m’intéresse à la rencontre entre mathématiques appliquées et informatique — de l’apprentissage automatique et la vérification formelle jusqu’à l’électronique.",
    homeBio2:
      "Je tiens ce site comme une trace de ce que j’apprends, construis et explore, avec quelques détours par la musique.",
    recentWriting: "Textes récents",
    allNotes: "Tous les textes",
    projects: "Projets",
    allProjects: "Tous les projets",
    status: {
      ongoing: "En cours",
      complete: "Terminé",
      archived: "Archivé",
    },
    writingLabel: "Textes",
    writingTitle: "Notes et essais",
    writingDesc: "Notes issues de mes études.",
    work: "Travaux",
    projectsDesc: "Projets de recherche et de programmation.",
    index: "Index",
    topics: "Sujets",
    topicsDesc: "Notes et projets classés par sujet.",
    entries: "entrées",
    entry: "entrée",
    music: "Musique",
    musicTitle: "Écoute et écriture",
    musicDesc: "Playlists et notes sur la musique.",
    spotifyProfile: "Profil Spotify",
    featuredPlaylists: "Playlists sélectionnées",
    musicWriting: "Textes sur la musique",
    musicEmpty: "Mes textes sur la musique apparaîtront ici.",
    about: "À propos",
    aboutTitle: "Je m’appelle Leo.",
    aboutIntro:
      "Je viens du Brésil et j’étudie actuellement dans le cycle ingénieur de l’École polytechnique, en France.",
    background: "Parcours",
    background1:
      "Avant de venir en France, j’ai étudié l’ingénierie informatique à l’ITA (Instituto Tecnológico de Aeronáutica), au Brésil. Cette formation m’a donné de solides bases en théorie du calcul et en conception matérielle, tout en éveillant ma curiosité pour les liens entre les idées abstraites et les machines qui leur donnent vie.",
    background2:
      "À l’École polytechnique, j’explore ce lien sous un autre angle, à travers les mathématiques appliquées et l’informatique. Je m’intéresse particulièrement à l’apprentissage automatique, à l’intelligence artificielle, à la vérification formelle et à l’électronique — surtout lorsque les problèmes traversent plusieurs de ces domaines.",
    thisArchive: "Ces archives",
    archiveText:
      "Ce site est l’endroit où je développe mes idées au fil du temps. J’y rassemble mes notes, documente mes projets et conserve les petites intuitions que l’on oublie facilement une fois un cours ou une expérience terminé.",
    outside: "En dehors des études",
    outsideText:
      "La musique est l’autre constante de ma vie. Guitariste amateur et auditeur curieux, je passe volontiers de l’indie au rock progressif, du metal à la techno ou à la trance, selon le moment.",
    elsewhere: "Ailleurs",
    researchNote: "Texte",
    project: "Projet",
    sourceCode: "Code source",
    filedUnder: "Sujets",
    englishOnly: "Cet article est actuellement disponible en anglais.",
  },
} as const;

export function localePath(locale: Locale, path = "") {
  const clean = path.replace(/^\//, "");
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${prefix}/${clean}`.replace(/\/$/, "") || "/";
}
