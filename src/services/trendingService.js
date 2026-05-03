// ═══════════════════════════════════════════════════════════════
// AYANIX TECH — TRENDING SERVICE
// Real daily trending topics — No API key needed!
// Sources: Google Trends RSS + Hacker News API + Reddit + NewsAPI fallback
// ═══════════════════════════════════════════════════════════════

// ── SOURCE 1: Hacker News Top Stories (Free, no key needed) ───
const fetchHackerNews = async () => {
  try {
    // Get top story IDs
    const idsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const ids = await idsRes.json();

    // Fetch top 8 stories
    const stories = await Promise.all(
      ids.slice(0, 8).map(async (id) => {
        const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return res.json();
      })
    );

    return stories
      .filter(s => s && s.title && s.score > 50)
      .map(s => ({
        title: s.title,
        description: s.url ? `${s.score} points on Hacker News` : '',
        source: 'Hacker News',
        url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
      }));
  } catch (e) {
    console.warn('HackerNews fetch failed:', e.message);
    return [];
  }
};

// ── SOURCE 2: Reddit Tech/Business (Free, no key needed) ──────
const fetchRedditTrending = async () => {
  try {
    // Use Reddit's JSON API — no auth needed for public posts
    const subreddits = ['technology', 'startups', 'web_design', 'digital_marketing'];
    const pick = subreddits[Math.floor(Date.now() / 3600000) % subreddits.length]; // rotate hourly

    const res = await fetch(
      `https://www.reddit.com/r/${pick}/hot.json?limit=8`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await res.json();

    return data.data.children
      .filter(p => p.data.score > 100 && !p.data.stickied)
      .slice(0, 5)
      .map(p => ({
        title: p.data.title,
        description: p.data.selftext
          ? p.data.selftext.slice(0, 120) + '...'
          : `r/${pick} — ${p.data.score} upvotes`,
        source: `Reddit r/${pick}`,
        url: `https://reddit.com${p.data.permalink}`,
      }));
  } catch (e) {
    console.warn('Reddit fetch failed:', e.message);
    return [];
  }
};

// ── SOURCE 3: Google Trends via RSS (Free, no key needed) ─────
const fetchGoogleTrends = async () => {
  try {
    // Google Trends daily trending searches RSS — India
    const rssUrl = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN';
    // Use a CORS proxy since RSS is XML
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    const res = await fetch(proxyUrl);
    const data = await res.json();

    if (data.status !== 'ok' || !data.items?.length) return [];

    return data.items.slice(0, 6).map(item => ({
      title: item.title,
      description: item.description
        ? item.description.replace(/<[^>]+>/g, '').slice(0, 120)
        : 'Trending in India today',
      source: 'Google Trends India',
      url: item.link || '',
    }));
  } catch (e) {
    console.warn('Google Trends fetch failed:', e.message);
    return [];
  }
};

// ── SOURCE 4: Dev.to Articles (Free, no key needed) ──────────
const fetchDevTo = async () => {
  try {
    const res = await fetch(
      'https://dev.to/api/articles?top=1&per_page=5',
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await res.json();

    return data
      .filter(a => a.positive_reactions_count > 50)
      .map(a => ({
        title: a.title,
        description: a.description || `${a.positive_reactions_count} reactions on Dev.to`,
        source: 'Dev.to',
        url: a.url,
      }));
  } catch (e) {
    console.warn('Dev.to fetch failed:', e.message);
    return [];
  }
};

// ── SOURCE 5: NewsAPI (if key is set) ─────────────────────────
const fetchNewsAPI = async () => {
  const key = process.env.REACT_APP_NEWS_API_KEY;
  if (!key) return [];

  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=in&category=technology&pageSize=8&apiKey=${key}`
    );
    const data = await res.json();
    if (!data.articles?.length) return [];

    return data.articles.map(a => ({
      title: a.title?.replace(/ - .*$/, '') || '',
      description: a.description || '',
      source: a.source?.name || 'NewsAPI',
      url: a.url || '',
    }));
  } catch (e) {
    console.warn('NewsAPI fetch failed:', e.message);
    return [];
  }
};

// ── DAILY ROTATION FALLBACK ───────────────────────────────────
// These rotate daily so Auto Mode always gets fresh content
const getDailyRotatingTopics = () => {
  const day = new Date().getDay(); // 0-6
  const date = new Date().getDate(); // 1-31

  const topicSets = [
    // Sunday
    [
      { title: 'Why Every Small Business Needs a Professional Website in 2026', source: 'Daily Topic', description: '' },
      { title: 'Top Web Design Trends Dominating 2026', source: 'Daily Topic', description: '' },
      { title: 'How AI is Changing Website Development', source: 'Daily Topic', description: '' },
    ],
    // Monday
    [
      { title: 'Monday Motivation: How Startups Built Their Digital Presence', source: 'Daily Topic', description: '' },
      { title: 'Meta Ads ROI: What Small Businesses Need to Know', source: 'Daily Topic', description: '' },
      { title: 'Local Business SEO Tips That Actually Work in 2026', source: 'Daily Topic', description: '' },
    ],
    // Tuesday
    [
      { title: 'Mobile App Development Cost in India 2026', source: 'Daily Topic', description: '' },
      { title: 'Why Your Website Loading Speed Costs You Customers', source: 'Daily Topic', description: '' },
      { title: 'E-Commerce Trends Reshaping Indian Businesses', source: 'Daily Topic', description: '' },
    ],
    // Wednesday
    [
      { title: 'UI/UX Design Principles Every Business Should Know', source: 'Daily Topic', description: '' },
      { title: 'How to Get More Leads From Your Website', source: 'Daily Topic', description: '' },
      { title: 'Custom Software vs Off-the-Shelf: What Is Right for You?', source: 'Daily Topic', description: '' },
    ],
    // Thursday
    [
      { title: 'Digital Marketing Strategies for Indian SMEs', source: 'Daily Topic', description: '' },
      { title: 'Google Ads vs Meta Ads: Which Delivers Better Results?', source: 'Daily Topic', description: '' },
      { title: 'How to Build Brand Trust Online in 2026', source: 'Daily Topic', description: '' },
    ],
    // Friday
    [
      { title: 'Weekend Sale: How to Promote Your Business on Social Media', source: 'Daily Topic', description: '' },
      { title: 'Top 5 Mistakes Small Businesses Make With Their Websites', source: 'Daily Topic', description: '' },
      { title: 'SEO in 2026: What Has Changed and What Still Works', source: 'Daily Topic', description: '' },
    ],
    // Saturday
    [
      { title: 'From Idea to Live Website in 15 Days — Is It Possible?', source: 'Daily Topic', description: '' },
      { title: 'Why Transparent Pricing Wins More Clients', source: 'Daily Topic', description: '' },
      { title: 'Building a High-Converting Landing Page in 2026', source: 'Daily Topic', description: '' },
    ],
  ];

  // Extra variety based on date (rotates monthly)
  const extraTopics = [
    { title: 'Voice Search Optimization for Local Businesses', source: 'Daily Topic', description: '' },
    { title: 'How to Rank #1 on Google Maps for Your Business', source: 'Daily Topic', description: '' },
    { title: 'WhatsApp Business API for Customer Engagement', source: 'Daily Topic', description: '' },
    { title: 'Why Startups Choose Custom Software Over SaaS', source: 'Daily Topic', description: '' },
    { title: 'Social Media Content Calendar for Small Businesses', source: 'Daily Topic', description: '' },
  ];

  const dayTopics = topicSets[day] || topicSets[0];
  const extraPick = extraTopics[date % extraTopics.length];

  return [...dayTopics, extraPick];
};

// ── MAIN EXPORT ───────────────────────────────────────────────
export const fetchTrendingTopics = async () => {
  // Try all real-time sources in parallel — fastest wins
  const [hn, reddit, google, devto, newsapi] = await Promise.allSettled([
    fetchHackerNews(),
    fetchRedditTrending(),
    fetchGoogleTrends(),
    fetchDevTo(),
    fetchNewsAPI(),
  ]);

  const realtime = [
    ...(hn.status       === 'fulfilled' ? hn.value       : []),
    ...(google.status   === 'fulfilled' ? google.value   : []),
    ...(reddit.status   === 'fulfilled' ? reddit.value   : []),
    ...(devto.status    === 'fulfilled' ? devto.value    : []),
    ...(newsapi.status  === 'fulfilled' ? newsapi.value  : []),
  ].filter(t => t.title && t.title.length > 5);

  // Always mix in daily rotating Ayanix-relevant topics
  const daily = getDailyRotatingTopics();

  if (realtime.length >= 3) {
    // Real-time topics first, then daily fillers
    const combined = [...realtime, ...daily];
    // Deduplicate by title similarity
    const seen = new Set();
    return combined.filter(t => {
      const key = t.title.slice(0, 30).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 15);
  }

  // All sources failed — return daily rotating topics
  return daily;
};