export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, imageUrl, accessToken, igAccountId } = req.body;

  if (!content || !accessToken || !igAccountId) {
    return res.status(400).json({ error: 'content, accessToken, igAccountId required' });
  }

  try {
    // Step 1: Create media container
    const containerBody = imageUrl
      ? { image_url: imageUrl, caption: content, access_token: accessToken }
      : { media_type: 'TEXT', text: content, access_token: accessToken };

    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${igAccountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(containerBody),
      }
    );

    const containerData = await containerRes.json();

    if (containerData.error) {
      return res.status(400).json({ error: containerData.error.message });
    }

    const creationId = containerData.id;

    // Step 2: Publish the container
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${igAccountId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    );

    const publishData = await publishRes.json();

    if (publishData.error) {
      return res.status(400).json({ error: publishData.error.message });
    }

    return res.status(200).json({ success: true, data: publishData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}