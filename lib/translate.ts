type TranslateFormat = "text" | "html";

type TranslateOptions = {
  target: string;
  format?: TranslateFormat;
  source?: string;
};

const DEFAULT_LIBRE_TRANSLATE_URL = "https://libretranslate.com/translate";
const DEFAULT_MAX_CHARS = 1800;
const DEFAULT_MAX_BATCH = 80;
const TRANSLATE_DEBUG = process.env.TRANSLATE_DEBUG === "true";

const logTranslateDebug = (message: string, meta?: Record<string, unknown>) => {
  if (!TRANSLATE_DEBUG) {
    return;
  }
  if (meta) {
    console.warn(`[translate] ${message}`, meta);
    return;
  }
  console.warn(`[translate] ${message}`);
};

const getCharLimit = () => {
  const raw = Number(process.env.LIBRE_TRANSLATE_MAX_CHARS ?? DEFAULT_MAX_CHARS);
  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_MAX_CHARS;
  }
  return Math.max(200, Math.floor(raw));
};

const getBatchLimit = () => {
  const raw = Number(
    process.env.LIBRE_TRANSLATE_MAX_BATCH ?? DEFAULT_MAX_BATCH,
  );
  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_MAX_BATCH;
  }
  return Math.max(1, Math.floor(raw));
};

const splitWithSeparators = (
  value: string,
  limit: number,
  separators: string[],
) => {
  const parts: string[] = [];
  let cursor = 0;

  while (cursor < value.length) {
    let end = Math.min(cursor + limit, value.length);

    if (end < value.length) {
      let cut = -1;
      for (const separator of separators) {
        const idx = value.lastIndexOf(separator, end);
        if (idx > cursor) {
          cut = Math.max(cut, idx + separator.length);
        }
      }
      if (cut > cursor) {
        end = cut;
      }
    }

    if (end <= cursor) {
      end = Math.min(cursor + limit, value.length);
    }

    parts.push(value.slice(cursor, end));
    cursor = end;
  }

  return parts;
};

const splitTextByLimit = (
  value: string,
  limit: number,
  format: TranslateFormat,
) => {
  if (value.length <= limit) {
    return [value];
  }

  const separators =
    format === "html"
      ? ["</p>", "</li>", "<br />", "<br/>", "<br>", "</div>", "</section>", "</h1>", "</h2>", "</h3>", "</h4>", "</h5>", "</h6>", "</ul>", "</ol>", "\n"]
      : [". ", "? ", "! ", "\n", "; ", ", "];

  return splitWithSeparators(value, limit, separators);
};

const extractTranslations = (data: unknown): string[] => {
  if (!data || typeof data !== "object") {
    return [];
  }

  const parsed = data as {
    translatedText?: unknown;
    translations?: unknown;
    data?: { translations?: unknown };
  };

  if (typeof parsed.translatedText === "string") {
    return [parsed.translatedText];
  }

  if (Array.isArray(parsed.translatedText)) {
    return parsed.translatedText.filter(
      (item): item is string => typeof item === "string",
    );
  }

  const translationsSource = Array.isArray(parsed.translations)
    ? parsed.translations
    : Array.isArray(parsed.data?.translations)
      ? parsed.data?.translations
      : [];

  return translationsSource
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }
      if (!item || typeof item !== "object") {
        return "";
      }
      const record = item as {
        translatedText?: unknown;
        translation?: unknown;
        text?: unknown;
      };
      return (
        (typeof record.translatedText === "string" && record.translatedText) ||
        (typeof record.translation === "string" && record.translation) ||
        (typeof record.text === "string" && record.text) ||
        ""
      );
    })
    .filter(Boolean);
};

export const translateTexts = async (
  texts: string[],
  options: TranslateOptions,
): Promise<string[]> => {
  const apiUrl = (process.env.LIBRE_TRANSLATE_URL ?? DEFAULT_LIBRE_TRANSLATE_URL)
    .trim();
  if (!apiUrl || texts.length === 0 || !options?.target) {
    logTranslateDebug("skip: missing api url/target/texts", {
      hasApiUrl: Boolean(apiUrl),
      hasTarget: Boolean(options?.target),
      textCount: texts.length,
    });
    return texts;
  }

  const entries = texts
    .map((text, index) => ({ text, index }))
    .filter(({ text }) => typeof text === "string" && text.trim().length > 0);

  if (entries.length === 0) {
    logTranslateDebug("skip: no non-empty texts");
    return texts;
  }

  const charLimit = getCharLimit();
  const batchLimit = getBatchLimit();
  const format = options.format ?? "text";

  const segments: Array<{ text: string; index: number }> = [];
  const segmentsByIndex = new Map<number, number[]>();

  entries.forEach((entry) => {
    const parts = splitTextByLimit(entry.text, charLimit, format);
    const ids: number[] = [];
    parts.forEach((part) => {
      const id = segments.length;
      segments.push({ text: part, index: entry.index });
      ids.push(id);
    });
    if (parts.length > 1) {
      logTranslateDebug("split text", {
        index: entry.index,
        parts: parts.length,
        length: entry.text.length,
      });
    }
    segmentsByIndex.set(entry.index, ids);
  });

  const batches: number[][] = [];
  let currentBatch: number[] = [];
  let currentSize = 0;

  segments.forEach((segment, id) => {
    const length = segment.text.length;
    if (
      currentBatch.length > 0 &&
      (currentSize + length > charLimit || currentBatch.length >= batchLimit)
    ) {
      batches.push(currentBatch);
      currentBatch = [];
      currentSize = 0;
    }
    currentBatch.push(id);
    currentSize += length;
  });

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  const translateBatch = async (batchIds: number[]): Promise<string[]> => {
    const batchTexts = batchIds.map((id) => segments[id].text);
    const url = new URL(apiUrl);
    const apiKey = process.env.LIBRE_TRANSLATE_API_KEY;
    const payload: Record<string, unknown> = {
      q: batchTexts.length === 1 ? batchTexts[0] : batchTexts,
      target: options.target,
      format,
      source: options.source ?? "en",
    };
    if (apiKey) {
      payload.api_key = apiKey;
    }

    logTranslateDebug("sending batch", {
      count: batchTexts.length,
      totalChars: batchTexts.reduce((sum, text) => sum + text.length, 0),
      target: options.target,
      format,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      logTranslateDebug("request failed", {
        status: response.status,
        statusText: response.statusText,
        body: errorText.slice(0, 300),
      });

      if (
        errorText.includes("exceeds text limit") &&
        batchTexts.length > 1
      ) {
        const results: string[] = [];
        for (let i = 0; i < batchIds.length; i += 1) {
          const text = batchTexts[i];
          const single = await translateBatch([batchIds[i]]);
          results.push(single[0] ?? text);
        }
        return results;
      }

      return batchTexts;
    }

    const data = (await response.json()) as unknown;
    const translations = extractTranslations(data);

    if (!Array.isArray(translations) || translations.length !== batchTexts.length) {
      logTranslateDebug("unexpected response shape", {
        expected: batchTexts.length,
        received: Array.isArray(translations) ? translations.length : "none",
      });
      return batchTexts;
    }

    logTranslateDebug("translated batch", {
      count: batchTexts.length,
      target: options.target,
      format,
    });

    return translations;
  };

  try {
    const translatedSegments: string[] = new Array(segments.length);
    for (const batch of batches) {
      const translated = await translateBatch(batch);
      translated.forEach((value, index) => {
        const segmentId = batch[index];
        translatedSegments[segmentId] = value;
      });
    }

    const output = [...texts];
    segmentsByIndex.forEach((segmentIds, index) => {
      const translatedParts = segmentIds.map((segmentId) => {
        const value = translatedSegments[segmentId];
        return typeof value === "string" && value.trim().length > 0
          ? value
          : segments[segmentId].text;
      });
      output[index] = translatedParts.join("");
    });

    return output;
  } catch (error) {
    logTranslateDebug("request error", {
      message: error instanceof Error ? error.message : String(error),
    });
    return texts;
  }
};
