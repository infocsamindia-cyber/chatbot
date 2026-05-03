import { useState, useEffect, useRef } from 'react';
import { generatePoster } from '../services/posterGenerator';
import { fetchTrendingTopics } from '../services/trendingService';

const AYANIX_CONTEXT = `
Company: Ayanix Tech
Founder & CEO: Ayan Ansari (21 years old, BCA 2nd year)
Website: ayanixtech.com
Team: 10+ specialists (developers, designers, marketers)
Location: Pathri, Maharashtra, India
Services: Website Development, UI/UX Design, Digital Growth, Meta Ads, SEO
USP: Fast delivery (7-15 days), transparent pricing, direct founder communication
Founded: February 15, 2026
Projects delivered: 27+
Tagline: "We build high-converting websites for growing businesses"
`;

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '📸', bestTime: '9:00 AM, 12:00 PM, 7:00 PM' },
  { id: 'linkedin',  label: 'LinkedIn',  icon: '💼', bestTime: '8:00 AM, 12:00 PM, 5:00 PM' },
  { id: 'twitter',   label: 'Twitter/X', icon: '🐦', bestTime: '8:00 AM, 3:00 PM, 9:00 PM'  },
  { id: 'facebook',  label: 'Facebook',  icon: '📘', bestTime: '9:00 AM, 1:00 PM, 8:00 PM'  },
  { id: 'youtube',   label: 'YouTube',   icon: '▶️', bestTime: '2:00 PM, 4:00 PM'            },
  { id: 'threads',   label: 'Threads',   icon: '🧵', bestTime: '10:00 AM, 7:00 PM'           },
];

const QUICK_TOPICS = [
  { icon: '🚀', label: 'New Project Launch',   value: 'We just launched a new client project successfully' },
  { icon: '👥', label: 'Team Highlight',        value: 'Highlight our amazing 10-member team at Ayanix Tech' },
  { icon: '💼', label: 'Service Promotion',     value: 'Promote our website development and digital growth services' },
  { icon: '⭐', label: 'Client Win',            value: 'We just got a new client and are excited to work with them' },
  { icon: '💡', label: 'Tech Tip',              value: 'Share a web development or digital marketing tip for businesses' },
  { icon: '🏆', label: 'Milestone',             value: 'Ayanix Tech has delivered 27+ projects since founding' },
  { icon: '📢', label: 'Free Consultation',     value: 'Promote our free consultation offer for new clients' },
  { icon: '👨‍💻', label: 'Behind the Scenes',  value: 'Show behind the scenes of building websites at Ayanix Tech' },
];

export default function CreatePost() {
  const [topic, setTopic]                         = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'linkedin']);
  const [generatedPosts, setGeneratedPosts]       = useState({});
  const [editedPosts, setEditedPosts]             = useState({});
  const [posters, setPosters]                     = useState({});
  const [loading, setLoading]                     = useState(false);
  const [tone, setTone]                           = useState('professional');
  const [editingPost, setEditingPost]             = useState(null);
  const [trending, setTrending]                   = useState([]);
  const [loadingTrending, setLoadingTrending]     = useState(false);
  const [activeTab, setActiveTab]                 = useState('write');
  const [scheduleTime, setScheduleTime]           = useState('');
  const [scheduledList, setScheduledList]         = useState(
    () => JSON.parse(localStorage.getItem('scheduledPosts') || '[]')
  );
  const [saveMsg, setSaveMsg] = useState('');

  // BUG FIX: Use refs to store textarea values for each platform
  // Original code used document.getElementById inside onClick which is unreliable
  // in React — the element may not exist or may have stale value.
  const textareaRefs = useRef({});

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    setLoadingTrending(true);
    const topics = await fetchTrendingTopics();
    setTrending(topics);
    setLoadingTrending(false);
  };

  const togglePlatform = (id) =>
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );

  const selectAll = () => setSelectedPlatforms(PLATFORMS.map(p => p.id));

  const callGroq = async (prompt) => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      }),
    });
    const data = await res.json();
    if (!data.choices?.[0]?.message?.content) throw new Error('Groq empty');
    return data.choices[0].message.content;
  };

  const callGemini = async (prompt) => {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  };

  const generateContent = async () => {
    if (!topic.trim() || selectedPlatforms.length === 0) {
      alert('Topic aur kam se kam ek platform select karo!');
      return;
    }
    setLoading(true);
    setGeneratedPosts({});
    setEditedPosts({});
    setPosters({});

    const results  = {};
    const posterMap = {};

    for (const platform of selectedPlatforms) {
      const prompt = `You are a social media expert for a tech startup.

COMPANY INFO:
${AYANIX_CONTEXT}

TASK: Write a ${tone} social media post for ${platform.toUpperCase()} about: "${topic}"

PLATFORM RULES:
- instagram: Engaging caption max 2200 chars + 15 relevant hashtags at end
- linkedin: Professional, story-driven, max 1500 chars, 3-5 hashtags
- twitter: Punchy, max 280 chars, 2-3 hashtags only
- facebook: Friendly & engaging, max 500 chars
- youtube: Video description with keywords, max 500 chars
- threads: Casual & conversational, max 500 chars

Write ONLY the post content. No explanations. No "Here is your post:" prefix.`;

      try {
        results[platform] = await callGroq(prompt);
      } catch {
        try {
          results[platform] = await callGemini(prompt);
        } catch {
          results[platform] = '❌ AI unavailable. Check API keys.';
        }
      }

      const shortText = topic.length > 55 ? topic.substring(0, 52) + '...' : topic;
      posterMap[platform] = generatePoster(shortText, platform);
    }

    setGeneratedPosts(results);
    // BUG FIX: Initialize editedPosts with generated content so edits are tracked in state
    setEditedPosts({ ...results });
    setPosters(posterMap);
    setLoading(false);
  };

  // BUG FIX: saveEdit now commits textarea value from state into editedPosts
  const saveEdit = (platformId) => {
    setEditingPost(null);
  };

  const schedulePost = () => {
    if (!scheduleTime || Object.keys(generatedPosts).length === 0) {
      alert('Pehle post generate karo aur time select karo!');
      return;
    }
    // BUG FIX: Use editedPosts so scheduled content includes any manual edits
    const newEntry = {
      id: Date.now(),
      topic,
      tone,
      platforms: selectedPlatforms,
      posts: editedPosts,
      scheduledAt: scheduleTime,
      createdAt: new Date().toISOString(),
    };
    const updated = [...scheduledList, newEntry];
    setScheduledList(updated);
    localStorage.setItem('scheduledPosts', JSON.stringify(updated));
    setSaveMsg('✅ Scheduled!');
    // BUG FIX: Store clearTimeout ref to avoid setState after unmount
    const t = setTimeout(() => setSaveMsg(''), 3000);
    return () => clearTimeout(t);
  };

  const getBestTime = () => {
    if (selectedPlatforms.length === 0) return '—';
    const p = PLATFORMS.find(x => x.id === selectedPlatforms[0]);
    return p?.bestTime || '—';
  };

  // BUG FIX: Copy button now uses editedPosts state, not DOM getElementById
  const copyContent = (platformId) => {
    const text = editedPosts[platformId] || generatedPosts[platformId] || '';
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <h2 className="text-2xl font-bold mb-1">✍️ Create Post</h2>
      <p className="text-gray-400 mb-6">Topic chuno — AI poster + content sab banayega 🤖</p>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        {['write', 'trending'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg capitalize font-medium transition ${
              activeTab === tab ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}>
            {tab === 'write' ? '⚡ Quick Topics' : '📰 Trending News'}
          </button>
        ))}
      </div>

      {/* QUICK TOPICS TAB */}
      {activeTab === 'write' && (
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-2">
            {QUICK_TOPICS.map(t => (
              <button key={t.label} onClick={() => setTopic(t.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition text-sm
                  ${topic === t.value
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-purple-500'}`}>
                <span className="text-2xl">{t.icon}</span>
                <span className="text-center leading-tight">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TRENDING TOPICS TAB */}
      {activeTab === 'trending' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Aaj ki trending tech & business news (India)</span>
            <button onClick={loadTrending}
              className="text-sm bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded-lg">
              🔄 Refresh
            </button>
          </div>
          {loadingTrending ? (
            <div className="text-gray-400 py-4">⏳ News fetch ho rahi hai...</div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {trending.length === 0 && (
                <p className="text-gray-500 text-sm">NewsAPI key set karo .env mein — REACT_APP_NEWS_API_KEY</p>
              )}
              {trending.map((t, i) => (
                <div key={i} onClick={() => {
                  setTopic(t.title + (t.description ? '. ' + t.description : ''));
                  setActiveTab('write');
                }}
                  className="p-3 bg-gray-900 border border-gray-700 hover:border-purple-500 rounded-xl cursor-pointer transition">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">{t.source}</span>
                  </div>
                  <p className="text-white text-sm">{t.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Custom Topic */}
      <div className="mb-6">
        <label className="block text-gray-400 mb-2">✏️ Topic / Idea</label>
        <textarea
          className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-purple-500"
          rows={2}
          placeholder="Koi bhi topic likho ya upar se select karo..."
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />
      </div>

      {/* Tone */}
      <div className="mb-6">
        <label className="block text-gray-400 mb-2">🎭 Tone</label>
        <div className="flex gap-3 flex-wrap">
          {[
            { key: 'professional',  icon: '👔' },
            { key: 'casual',        icon: '😎' },
            { key: 'funny',         icon: '😂' },
            { key: 'inspirational', icon: '🔥' },
          ].map(t => (
            <button key={t.key} onClick={() => setTone(t.key)}
              className={`px-4 py-2 rounded-lg capitalize transition flex items-center gap-2 ${
                tone === t.key ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}>
              {t.icon} {t.key}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-gray-400">🌐 Platforms</label>
          <button onClick={selectAll} className="text-purple-400 text-sm hover:text-purple-300">
            Select All
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => togglePlatform(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition border ${
                selectedPlatforms.includes(p.id)
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-purple-500'
              }`}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Best Time Hint */}
      {selectedPlatforms.length > 0 && (
        <div className="mb-6 flex items-center gap-2 text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-4 py-3">
          ⏰ <strong>{PLATFORMS.find(x => x.id === selectedPlatforms[0])?.label}</strong> ke liye best posting time:{' '}
          <span className="font-bold">{getBestTime()}</span>
        </div>
      )}

      {/* Generate Button */}
      <button onClick={generateContent} disabled={loading}
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition mb-4">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span> AI likh raha hai + poster bana raha hai...
          </span>
        ) : '🚀 Generate Posts + Posters'}
      </button>

      {/* Schedule Section */}
      {Object.keys(generatedPosts).length > 0 && (
        <div className="mb-8 bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <label className="block text-gray-400 text-sm mb-1">📅 Schedule karo</label>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={e => setScheduleTime(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>
          <button onClick={schedulePost}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-xl font-bold transition">
            📅 Schedule Post
          </button>
          {saveMsg && <span className="text-green-400 font-bold">{saveMsg}</span>}
        </div>
      )}

      {/* Generated Results */}
      {Object.keys(generatedPosts).length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4 text-green-400">✅ Posts + Posters Ready!</h3>
          {selectedPlatforms.map(platformId => {
            const content   = editedPosts[platformId] || generatedPosts[platformId];
            const poster    = posters[platformId];
            const p         = PLATFORMS.find(x => x.id === platformId);
            const isEditing = editingPost === platformId;
            if (!generatedPosts[platformId]) return null;

            return (
              <div key={platformId} className="mb-6 bg-gray-900 border border-gray-800 rounded-2xl p-6">

                {/* Platform header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-lg flex items-center gap-2">
                    {p?.icon} {p?.label}
                    <span className="text-xs text-gray-500 font-normal">⏰ {p?.bestTime}</span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (isEditing) {
                          // Save: already tracked via onChange on textarea
                          saveEdit(platformId);
                        } else {
                          setEditingPost(platformId);
                        }
                      }}
                      className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg">
                      {isEditing ? '💾 Save' : '✏️ Edit'}
                    </button>
                    {/* BUG FIX: Copy uses state, not DOM getElementById */}
                    <button onClick={() => copyContent(platformId)}
                      className="text-sm bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded-lg">
                      📋 Copy
                    </button>
                  </div>
                </div>

                {/* Two column: text + poster */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    {isEditing ? (
                      // BUG FIX: Controlled textarea with value + onChange instead of defaultValue + ref
                      <textarea
                        ref={el => { textareaRefs.current[platformId] = el; }}
                        value={content}
                        onChange={e =>
                          setEditedPosts(prev => ({ ...prev, [platformId]: e.target.value }))
                        }
                        className="w-full bg-gray-800 text-white p-3 rounded-xl resize-none focus:outline-none border border-gray-700"
                        rows={8}
                      />
                    ) : (
                      <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                        {content}
                      </p>
                    )}
                    <div className="mt-2 text-xs text-gray-600">{(content || '').length} characters</div>
                  </div>

                  {/* Poster */}
                  {poster && (
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <img src={poster} alt="AI Poster"
                        className="w-44 h-44 rounded-xl object-cover border border-gray-700 shadow-lg" />
                      <a href={poster} download={`${platformId}-poster-${Date.now()}.png`}
                        className="text-xs bg-green-700 hover:bg-green-600 px-3 py-1 rounded-lg transition">
                        ⬇️ Download
                      </a>
                      <button onClick={() => {
                        const shortText = topic.length > 55 ? topic.substring(0, 52) + '...' : topic;
                        setPosters(prev => ({ ...prev, [platformId]: generatePoster(shortText, platformId) }));
                      }}
                        className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition">
                        🎨 New Design
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scheduled Posts List */}
      {scheduledList.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4 text-blue-400">📅 Scheduled Posts ({scheduledList.length})</h3>
          {scheduledList.slice().reverse().map(item => (
            <div key={item.id} className="mb-3 bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium truncate max-w-xs">{item.topic}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {item.platforms.map(pid => PLATFORMS.find(x => x.id === pid)?.icon).join(' ')}
                  {' · '}
                  {new Date(item.scheduledAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button onClick={() => {
                const updated = scheduledList.filter(x => x.id !== item.id);
                setScheduledList(updated);
                localStorage.setItem('scheduledPosts', JSON.stringify(updated));
              }}
                className="text-red-400 hover:text-red-300 text-sm px-3 py-1 rounded-lg hover:bg-gray-800">
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}