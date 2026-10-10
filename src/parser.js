import { XMLParser } from 'fast-xml-parser';

export function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

export function parseNewsXml(xmlContent) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    trimValues: true
  });

  const parsed = parser.parse(xmlContent);
  const channel = parsed?.rss?.channel;
  if (!channel) {
    throw new Error('Invalid RSS feed structure received from Google News.');
  }

  const rawItems = channel.item || [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items.map((item, index) => {
    let rawTitle = item.title || 'Untitled';
    let publisher = '';
    let publisherUrl = '';

    if (item.source) {
      if (typeof item.source === 'string') {
        publisher = item.source;
      } else if (typeof item.source === 'object') {
        publisher = item.source['#text'] || '';
        publisherUrl = item.source['@_url'] || '';
      }
    }

    // Google News RSS titles usually end with " - Publisher Name"
    let title = rawTitle;
    const lastDashIdx = rawTitle.lastIndexOf(' - ');
    if (lastDashIdx !== -1) {
      const extractedPublisher = rawTitle.slice(lastDashIdx + 3).trim();
      title = rawTitle.slice(0, lastDashIdx).trim();
      if (!publisher) {
        publisher = extractedPublisher;
      }
    }

    const pubDate = item.pubDate || '';
    const timeAgo = formatTimeAgo(pubDate);

    return {
      id: index + 1,
      title,
      fullTitle: rawTitle,
      link: item.link || '',
      publisher: publisher || 'Unknown',
      publisherUrl,
      pubDate,
      timeAgo
    };
  });
}
