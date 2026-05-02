// ═══════════════════════════════════════════════════════════════
// AYANIX TECH — COMPLETE POSTING SERVICE
// Sare 6 platforms: Twitter, LinkedIn, YouTube, Facebook, Instagram, Threads
// ═══════════════════════════════════════════════════════════════

const delay = (ms) => new Promise(r => setTimeout(r, ms));

// ── TWITTER/X ────────────────────────────────────────────────────
export const postToTwitter = async (content) => {
  try {
    const response = await fetch('/api/post-twitter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.slice(0, 280) }),
    });
    const data = await response.json();
    if (data.success) return { success: true, platform: 'twitter' };
    throw new Error(data.error || 'Twitter post failed');
  } catch (e) {
    return { success: false, platform: 'twitter', error: e.message };
  }
};

// ── LINKEDIN ─────────────────────────────────────────────────────
export const postToLinkedIn = async (content) => {
  try {
    const accessToken = localStorage.getItem('linkedin_access_token');
    const authorUrn   = localStorage.getItem('linkedin_author_urn');
    if (!accessToken || !authorUrn) {
      return { success: false, platform: 'linkedin', error: 'LinkedIn login required', needsAuth: true };
    }
    const response = await fetch('/api/post-linkedin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, accessToken, authorUrn }),
    });
    const data = await response.json();
    if (data.success) return { success: true, platform: 'linkedin' };
    throw new Error(data.error || 'LinkedIn post failed');
  } catch (e) {
    return { success: false, platform: 'linkedin', error: e.message };
  }
};

// ── YOUTUBE ──────────────────────────────────────────────────────
export const postToYouTube = async (title, description) => {
  try {
    const accessToken = localStorage.getItem('youtube_access_token');
    if (!accessToken) {
      return { success: false, platform: 'youtube', error: 'YouTube login required', needsAuth: true };
    }
    const response = await fetch('/api/post-youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, accessToken }),
    });
    const data = await response.json();
    if (data.success) return { success: true, platform: 'youtube' };
    throw new Error(data.error || 'YouTube post failed');
  } catch (e) {
    return { success: false, platform: 'youtube', error: e.message };
  }
};

// ── FACEBOOK ─────────────────────────────────────────────────────
export const postToFacebook = async (content) => {
  try {
    const accessToken = localStorage.getItem('facebook_access_token');
    const pageId      = localStorage.getItem('facebook_page_id');
    if (!accessToken || !pageId) {
      return { success: false, platform: 'facebook', error: 'Facebook login required', needsAuth: true };
    }
    const response = await fetch('/api/post-facebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, accessToken, pageId }),
    });
    const data = await response.json();
    if (data.success) return { success: true, platform: 'facebook' };
    throw new Error(data.error || 'Facebook post failed');
  } catch (e) {
    return { success: false, platform: 'facebook', error: e.message };
  }
};

// ── INSTAGRAM ────────────────────────────────────────────────────
export const postToInstagram = async (content, imageUrl) => {
  try {
    const accessToken = localStorage.getItem('instagram_access_token');
    const igAccountId = localStorage.getItem('instagram_account_id');
    if (!accessToken || !igAccountId) {
      return { success: false, platform: 'instagram', error: 'Instagram login required', needsAuth: true };
    }
    const response = await fetch('/api/post-instagram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, imageUrl, accessToken, igAccountId }),
    });
    const data = await response.json();
    if (data.success) return { success: true, platform: 'instagram' };
    throw new Error(data.error || 'Instagram post failed');
  } catch (e) {
    return { success: false, platform: 'instagram', error: e.message };
  }
};

// ── THREADS ──────────────────────────────────────────────────────
export const postToThreads = async (content) => {
  try {
    const accessToken   = localStorage.getItem('threads_access_token');
    const threadsUserId = localStorage.getItem('threads_user_id');
    if (!accessToken || !threadsUserId) {
      return { success: false, platform: 'threads', error: 'Threads login required', needsAuth: true };
    }
    const response = await fetch('/api/post-threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, accessToken, threadsUserId }),
    });
    const data = await response.json();
    if (data.success) return { success: true, platform: 'threads' };
    throw new Error(data.error || 'Threads post failed');
  } catch (e) {
    return { success: false, platform: 'threads', error: e.message };
  }
};

// ── POST TO ALL PLATFORMS ─────────────────────────────────────────
export const postToAllPlatforms = async (posts) => {
  const results = {};

  if (posts.twitter) {
    results.twitter = await postToTwitter(posts.twitter);
    await delay(1000);
  }
  if (posts.linkedin) {
    results.linkedin = await postToLinkedIn(posts.linkedin);
    await delay(1000);
  }
  if (posts.youtube) {
    results.youtube = await postToYouTube('Ayanix Tech Update', posts.youtube);
    await delay(1000);
  }
  if (posts.facebook) {
    results.facebook = await postToFacebook(posts.facebook);
    await delay(1000);
  }
  if (posts.instagram) {
    results.instagram = await postToInstagram(posts.instagram, null);
    await delay(1000);
  }
  if (posts.threads) {
    results.threads = await postToThreads(posts.threads);
    await delay(1000);
  }

  return results;
};