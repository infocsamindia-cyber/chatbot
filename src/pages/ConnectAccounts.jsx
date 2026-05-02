import { useState, useEffect } from 'react';

const PLATFORMS = [
  {
    id: 'twitter',
    label: 'Twitter/X',
    icon: '🐦',
    color: 'from-sky-600 to-cyan-500',
    tokenKey: 'twitter_connected',
    description: 'Automatically configured via API keys',
    autoConnect: true,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: '📘',
    color: 'from-indigo-700 to-indigo-500',
    tokenKey: 'facebook_access_token',
    description: 'Connect your Facebook Page to post automatically',
    autoConnect: false,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: '📸',
    color: 'from-pink-600 to-purple-600',
    tokenKey: 'instagram_access_token',
    description: 'Connect Instagram Business account',
    autoConnect: false,
  },
  {
    id: 'threads',
    label: 'Threads',
    icon: '🧵',
    color: 'from-gray-700 to-gray-500',
    tokenKey: 'threads_access_token',
    description: 'Connect Threads account via Meta',
    autoConnect: false,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: '💼',
    color: 'from-blue-700 to-blue-500',
    tokenKey: 'linkedin_access_token',
    description: 'Connect LinkedIn to post on your profile/page',
    autoConnect: false,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: '▶️',
    color: 'from-red-700 to-red-500',
    tokenKey: 'youtube_access_token',
    description: 'Connect YouTube channel for community posts',
    autoConnect: false,
  },
];

export default function ConnectAccounts() {
  const [connected, setConnected]       = useState({});
  const [manualToken, setManualToken]   = useState({});
  const [showManual, setShowManual]     = useState({});
  const [saving, setSaving]             = useState({});
  const [savedMsg, setSavedMsg]         = useState({});

  // Load connection status from localStorage
  useEffect(() => {
    const status = {};
    PLATFORMS.forEach(p => {
      if (p.autoConnect) {
        status[p.id] = true;
      } else {
        status[p.id] = !!localStorage.getItem(p.tokenKey);
      }
    });
    setConnected(status);
  }, []);

  // ── OAuth Flows ──────────────────────────────────────────────
  const connectFacebook = () => {
    const appId       = process.env.REACT_APP_META_APP_ID;
    const redirectUri = encodeURIComponent(window.location.origin + '/connect');
    const scope       = encodeURIComponent('pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish,threads_basic,threads_content_publish');
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;
    window.location.href = url;
  };

  const connectLinkedIn = () => {
    const clientId    = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin + '/connect');
    const scope       = encodeURIComponent('openid profile w_member_social');
    const state       = 'linkedin_oauth';
    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    window.location.href = url;
  };

  const connectYouTube = () => {
    const clientId    = process.env.REACT_APP_YOUTUBE_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin + '/connect');
    const scope       = encodeURIComponent('https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload');
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token&access_type=online`;
    window.location.href = url;
  };

  // ── Handle OAuth Callback ─────────────────────────────────────
  useEffect(() => {
    const hash   = window.location.hash;
    const search = window.location.search;

    // Facebook/Instagram/Threads — access_token in hash
    if (hash.includes('access_token')) {
      const params      = new URLSearchParams(hash.replace('#', ''));
      const accessToken = params.get('access_token');
      if (accessToken) {
        // Save for Facebook, Instagram, Threads — same token
        localStorage.setItem('facebook_access_token', accessToken);
        localStorage.setItem('instagram_access_token', accessToken);
        localStorage.setItem('threads_access_token', accessToken);
        // Fetch Page ID
        fetchFacebookPageId(accessToken);
        window.history.replaceState({}, '', '/connect');
      }
    }

    // YouTube — access_token in hash
    if (hash.includes('access_token') && !hash.includes('facebook')) {
      const params      = new URLSearchParams(hash.replace('#', ''));
      const accessToken = params.get('access_token');
      if (accessToken) {
        localStorage.setItem('youtube_access_token', accessToken);
        window.history.replaceState({}, '', '/connect');
      }
    }

    // LinkedIn — code in search params
    if (search.includes('code') && search.includes('linkedin')) {
      const params = new URLSearchParams(search);
      const code   = params.get('code');
      if (code) {
        localStorage.setItem('linkedin_auth_code', code);
        alert('LinkedIn code mila! Manually access token generate karna hoga — neeche manual token section mein paste karo.');
        window.history.replaceState({}, '', '/connect');
      }
    }

    // Reload connection status
    const status = {};
    PLATFORMS.forEach(p => {
      status[p.id] = p.autoConnect || !!localStorage.getItem(p.tokenKey);
    });
    setConnected(status);
  }, []);

  const fetchFacebookPageId = async (accessToken) => {
    try {
      const res  = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        const page = data.data[0];
        localStorage.setItem('facebook_page_id', page.id);
        localStorage.setItem('facebook_page_token', page.access_token);
        localStorage.setItem('facebook_access_token', page.access_token);
        // Fetch Instagram account ID
        fetchInstagramAccountId(page.id, page.access_token);
        fetchThreadsUserId(accessToken);
        alert(`✅ Facebook Page connected: ${page.name}`);
      } else {
        alert('⚠️ Koi Facebook Page nahi mila. Ayanix Tech Page banao pehle.');
      }
    } catch (e) {
      console.error('Facebook page fetch error:', e);
    }
  };

  const fetchInstagramAccountId = async (pageId, pageToken) => {
    try {
      const res  = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`);
      const data = await res.json();
      if (data.instagram_business_account) {
        localStorage.setItem('instagram_account_id', data.instagram_business_account.id);
        alert('✅ Instagram Business account bhi connected!');
      }
    } catch (e) {
      console.error('Instagram account fetch error:', e);
    }
  };

  const fetchThreadsUserId = async (accessToken) => {
    try {
      const res  = await fetch(`https://graph.threads.net/v1.0/me?access_token=${accessToken}`);
      const data = await res.json();
      if (data.id) {
        localStorage.setItem('threads_user_id', data.id);
        alert('✅ Threads account connected!');
      }
    } catch (e) {
      console.error('Threads user fetch error:', e);
    }
  };

  // ── Manual Token Save ─────────────────────────────────────────
  const saveManualToken = async (platformId) => {
    const token = manualToken[platformId];
    if (!token) { alert('Token daalo pehle!'); return; }
    setSaving(prev => ({ ...prev, [platformId]: true }));

    const p = PLATFORMS.find(x => x.id === platformId);
    localStorage.setItem(p.tokenKey, token);

    if (platformId === 'linkedin') {
      localStorage.setItem('linkedin_author_urn', `urn:li:person:${token.split('_')[0]}`);
    }
    if (platformId === 'threads') {
      localStorage.setItem('threads_user_id', token.split('_')[0]);
    }

    setConnected(prev => ({ ...prev, [platformId]: true }));
    setSaving(prev => ({ ...prev, [platformId]: false }));
    setSavedMsg(prev => ({ ...prev, [platformId]: '✅ Saved!' }));
    setTimeout(() => setSavedMsg(prev => ({ ...prev, [platformId]: '' })), 3000);
  };

  const disconnect = (platformId) => {
    const p = PLATFORMS.find(x => x.id === platformId);
    localStorage.removeItem(p.tokenKey);
    if (platformId === 'facebook') {
      localStorage.removeItem('facebook_page_id');
      localStorage.removeItem('facebook_page_token');
    }
    if (platformId === 'instagram') localStorage.removeItem('instagram_account_id');
    if (platformId === 'threads')   localStorage.removeItem('threads_user_id');
    if (platformId === 'linkedin')  localStorage.removeItem('linkedin_author_urn');
    if (platformId === 'youtube')   localStorage.removeItem('youtube_access_token');
    setConnected(prev => ({ ...prev, [platformId]: false }));
  };

  const handleConnect = (platformId) => {
    if      (platformId === 'facebook' || platformId === 'instagram' || platformId === 'threads') connectFacebook();
    else if (platformId === 'linkedin') connectLinkedIn();
    else if (platformId === 'youtube')  connectYouTube();
  };

  const connectedCount = Object.values(connected).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-gray-900 border-b border-gray-800 px-8 py-6">
        <h1 className="text-2xl font-black mb-1">🔗 Connect Accounts</h1>
        <p className="text-gray-400 text-sm">
          Sare social media accounts connect karo — phir direct post ho payega!
        </p>
        <div className="flex items-center gap-3 mt-3">
          <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl px-4 py-2">
            <span className="text-purple-400 font-bold">{connectedCount}/6</span>
            <span className="text-gray-400 text-sm ml-2">platforms connected</span>
          </div>
          {connectedCount === 6 && (
            <span className="text-green-400 font-bold">🎉 Sab connected!</span>
          )}
        </div>
      </div>

      <div className="px-8 py-6 max-w-4xl">

        {/* Progress bar */}
        <div className="mb-6 bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Connection Progress</span>
            <span>{connectedCount}/6</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-600 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(connectedCount / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 gap-4">
          {PLATFORMS.map(platform => {
            const isConnected = connected[platform.id];
            return (
              <div key={platform.id}
                className={`bg-gray-900 border rounded-2xl overflow-hidden transition ${
                  isConnected ? 'border-green-500/40' : 'border-gray-800 hover:border-purple-500/40'
                }`}>

                {/* Platform Header */}
                <div className={`bg-gradient-to-r ${platform.color} px-5 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <span className="font-bold text-white text-lg">{platform.label}</span>
                      <p className="text-white/60 text-xs">{platform.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <>
                        <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-2 py-1 rounded-full font-bold">
                          ✅ Connected
                        </span>
                        {!platform.autoConnect && (
                          <button
                            onClick={() => disconnect(platform.id)}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 text-xs px-2 py-1 rounded-lg transition">
                            Disconnect
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="bg-gray-500/20 text-gray-400 border border-gray-500/30 text-xs px-2 py-1 rounded-full">
                        ○ Not Connected
                      </span>
                    )}
                  </div>
                </div>

                {/* Connect Options */}
                {!isConnected && !platform.autoConnect && (
                  <div className="p-5">

                    {/* OAuth Button */}
                    {(platform.id === 'facebook' || platform.id === 'instagram' ||
                      platform.id === 'threads' || platform.id === 'linkedin' ||
                      platform.id === 'youtube') && (
                      <button
                        onClick={() => handleConnect(platform.id)}
                        className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${platform.color} hover:opacity-90 transition mb-3`}>
                        🔐 {platform.label} se Login Karo (OAuth)
                      </button>
                    )}

                    {/* Manual Token Toggle */}
                    <button
                      onClick={() => setShowManual(prev => ({ ...prev, [platform.id]: !prev[platform.id] }))}
                      className="w-full py-2 rounded-xl text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 text-sm transition">
                      {showManual[platform.id] ? '▲ Manual token band karo' : '✏️ Manual Access Token paste karo'}
                    </button>

                    {showManual[platform.id] && (
                      <div className="mt-3">
                        <p className="text-gray-400 text-xs mb-2">
                          {platform.id === 'linkedin' && 'LinkedIn Developer Console se Access Token copy karo'}
                          {platform.id === 'youtube' && 'Google OAuth Playground se Access Token copy karo'}
                          {platform.id === 'facebook' && 'Meta Graph API Explorer se Page Access Token copy karo'}
                          {platform.id === 'instagram' && 'Meta Graph API Explorer se Instagram Access Token copy karo'}
                          {platform.id === 'threads' && 'Threads API se Access Token copy karo'}
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`${platform.label} Access Token paste karo...`}
                            value={manualToken[platform.id] || ''}
                            onChange={e => setManualToken(prev => ({ ...prev, [platform.id]: e.target.value }))}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                          />
                          <button
                            onClick={() => saveManualToken(platform.id)}
                            disabled={saving[platform.id]}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-bold transition">
                            {saving[platform.id] ? '...' : 'Save'}
                          </button>
                        </div>
                        {savedMsg[platform.id] && (
                          <p className="text-green-400 text-xs mt-1">{savedMsg[platform.id]}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Twitter — Auto configured */}
                {platform.id === 'twitter' && (
                  <div className="px-5 py-3 bg-green-500/5 border-t border-green-500/20">
                    <p className="text-green-400 text-xs">
                      ✅ Twitter API keys .env mein set hain — koi login nahi chahiye!
                    </p>
                  </div>
                )}

                {/* Connected Info */}
                {isConnected && !platform.autoConnect && (
                  <div className="px-5 py-3 bg-green-500/5 border-t border-green-500/20">
                    <p className="text-green-400 text-xs">
                      ✅ {platform.label} connected hai — posts directly jayenge!
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-2xl p-5">
          <h3 className="text-blue-300 font-bold mb-3">💡 Manual Token Kahan Se Milega?</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>📘 <strong className="text-white">Facebook/Instagram/Threads:</strong> developers.facebook.com → Tools → Graph API Explorer → Generate Token</p>
            <p>💼 <strong className="text-white">LinkedIn:</strong> linkedin.com/developers → app → Auth tab → Access Token</p>
            <p>▶️ <strong className="text-white">YouTube:</strong> developers.google.com/oauthplayground → Select YouTube API → Exchange</p>
          </div>
        </div>

      </div>
    </div>
  );
}