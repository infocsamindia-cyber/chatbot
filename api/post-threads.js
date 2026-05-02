export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, accessToken, threadsUserId } = req.body;

  if (!content || !accessToken || !threadsUserId) {
    return res.status(400).json({ error: 'content, accessToken, threadsUserId required' });
  }

  try {
    // Step 1: Create Threads container
    const containerRes = await fetch(
      `https://graph.threads.net/v1.0/${threadsUserId}/threads`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'TEXT',
          text: content,
          access_token: accessToken,
        }),
      }
    );

    const containerData = await containerRes.json();

    if (containerData.error) {
      return res.status(400).json({ error: containerData.error.message });
    }

    const creationId = containerData.id;

    // Step 2: Publish
    const publishRes = await fetch(
      `https://graph.threads.net/v1.0/${threadsUserId}/threads_publish`,
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