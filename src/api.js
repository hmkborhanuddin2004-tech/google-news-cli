export const TOPICS = {
  world: { id: 'WORLD', name: 'World' },
  nation: { id: 'NATION', name: 'Nation' },
  business: { id: 'BUSINESS', name: 'Business', aliases: ['biz'] },
  technology: { id: 'TECHNOLOGY', name: 'Technology', aliases: ['tech'] },
  entertainment: { id: 'ENTERTAINMENT', name: 'Entertainment' },
  sports: { id: 'SPORTS', name: 'Sports', aliases: ['sport'] },
  science: { id: 'SCIENCE', name: 'Science', aliases: ['sci'] },
  health: { id: 'HEALTH', name: 'Health' }
};

export function resolveTopic(input) {
  if (!input) return null;
  const normalized = input.toLowerCase().trim();
  for (const [key, meta] of Object.entries(TOPICS)) {
    if (key === normalized || meta.id.toLowerCase() === normalized) {
      return meta;
    }
    if (meta.aliases && meta.aliases.includes(normalized)) {
      return meta;
    }
  }
  // If not found in preset, return uppercase topic ID directly
  return { id: input.toUpperCase(), name: input };
}

export function buildRssUrl({ type = 'top', query = '', topic = '', country = 'US', lang = 'en' } = {}) {
  const gl = country.toUpperCase();
  const hl = `${lang.toLowerCase()}-${gl}`;
  const ceid = `${gl}:${lang.toLowerCase()}`;
  const baseParams = `hl=${encodeURIComponent(hl)}&gl=${encodeURIComponent(gl)}&ceid=${encodeURIComponent(ceid)}`;

  if (type === 'search' && query) {
    return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&${baseParams}`;
  }

  if (type === 'topic' && topic) {
    const resolved = resolveTopic(topic);
    return `https://news.google.com/rss/headlines/section/topic/${encodeURIComponent(resolved.id)}?${baseParams}`;
  }

  return `https://news.google.com/rss?${baseParams}`;
}

export async function fetchNewsXml(options = {}) {
  const url = buildRssUrl(options);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
      }
    });

    if (!response.ok) {
      throw new Error(`Google News returned HTTP ${response.status}: ${response.statusText}`);
    }

    const xml = await response.text();
    return xml;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out while connecting to Google News RSS feed.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
