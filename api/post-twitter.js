export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content required' });
  }

  try {
    const OAuth = await import('oauth-1.0a');
    const crypto = await import('crypto');

    const oauth = new OAuth.default({
      consumer: {
        key: process.env.REACT_APP_TWITTER_CONSUMER_KEY,
        secret: process.env.REACT_APP_TWITTER_CONSUMER_SECRET,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.default
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64');
      },
    });

    const token = {
      key: process.env.REACT_APP_TWITTER_ACCESS_TOKEN,
      secret: process.env.REACT_APP_TWITTER_ACCESS_SECRET,
    };

    const url = 'https://api.twitter.com/2/tweets';
    const authHeader = oauth.toHeader(oauth.authorize({ url, method: 'POST' }, token));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: content.slice(0, 280) }),
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ error: data.errors[0].message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}