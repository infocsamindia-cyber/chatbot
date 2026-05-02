export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, description, accessToken } = req.body;

  if (!title || !description || !accessToken) {
    return res.status(400).json({ error: 'title, description, accessToken required' });
  }

  try {
    // YouTube Community Post
    const response = await fetch(
      'https://www.googleapis.com/youtube/v3/communityPosts?part=snippet',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snippet: {
            type: 'textPost',
            textOriginalPost: { text: `${title}\n\n${description}` },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.error?.message || 'YouTube post failed' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}