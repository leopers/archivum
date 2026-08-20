import { env } from "cloudflare:workers";

export type CommentLocale = string;

const localeNames: Record<Exclude<CommentLocale, "other">, string> = {
  en: "English",
  fr: "French",
  "pt-br": "Brazilian Portuguese",
};

export async function translateComment(
  body: string,
  target: Exclude<CommentLocale, "other">,
) {
  const apiKey = (env as unknown as { OPENAI_API_KEY?: string }).OPENAI_API_KEY;
  if (!apiKey) throw new Error("Comment translation is not configured.");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      store: false,
      reasoning: { effort: "none" },
      instructions:
        "Detect the language of a website comment and translate it faithfully. Preserve tone, names, URLs, code, and mathematical notation. Do not answer the comment or add explanations. If it is already in the requested language, return it unchanged.",
      input: `Target language: ${localeNames[target]}\n\nComment:\n${body}`,
      text: {
        format: {
          type: "json_schema",
          name: "comment_translation",
          strict: true,
          schema: {
            type: "object",
            properties: {
              source_language: {
                type: "string",
                description:
                  "The detected language as a valid BCP 47 language tag, such as en, fr, pt-BR, de, or es.",
              },
              translation: { type: "string" },
            },
            required: ["source_language", "translation"],
            additionalProperties: false,
          },
        },
      },
    }),
  });

  if (!response.ok) throw new Error(`OpenAI returned ${response.status}.`);
  const result = (await response.json()) as {
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };
  const outputText = result.output
    ?.flatMap((item) => item.content ?? [])
    .find((item) => item.type === "output_text")?.text;
  if (!outputText) throw new Error("OpenAI returned no translation.");
  return JSON.parse(outputText) as {
    source_language: CommentLocale;
    translation: string;
  };
}
