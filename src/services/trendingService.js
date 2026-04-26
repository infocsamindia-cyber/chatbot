export const fetchTrendingTopics = async () => {
  const key = process.env.REACT_APP_NEWS_API_KEY;
  if (!key) return getFallback();
  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=in&category=technology&pageSize=15&apiKey=${key}`
    );
    const data = await res.json();
    if (!data.articles?.length) return getFallback();
    return data.articles.map(a => ({
      title: a.title?.replace(/ - .*$/, ''),
      description: a.description,
      source: a.source?.name || 'News',
      url: a.url,
    }));
  } catch {
    return getFallback();
  }
};

const getFallback = () => [
  { title: 'AI Tools for Small Businesses in 2026', source: 'Trending', description: '' },
  { title: 'Web Design Trends Dominating 2026', source: 'Trending', description: '' },
  { title: 'Digital Marketing Tips for Local Businesses', source: 'Trending', description: '' },
  { title: 'Why Every Business Needs a Mobile-First Website', source: 'Trending', description: '' },
  { title: 'Meta Ads vs Google Ads: Which Works Better?', source: 'Trending', description: '' },
];