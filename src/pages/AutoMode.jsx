import { useState, useEffect, useRef } from 'react';
import { generatePoster } from '../services/posterGenerator';
import { fetchTrendingTopics } from '../services/trendingService';
import { db, auth } from '../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const AYANIX_CONTEXT = `
Company: Ayanix Tech
Founder & CEO: Ayan Ansari (21 years old, BCA 2nd year)
Website: ayanixtech.com
Team: 10+ specialists
Location: Pathri, Maharashtra, India
Services: Website Development, Mobile App Development, Custom Software, UI/UX Design, Digital Growth, Meta Ads, SEO, E-Commerce
USP: Fast delivery 7-15 days, transparent pricing, direct founder communication
Founded: February 15, 2026 | Projects: 27+
Tagline: We build high-converting websites for growing businesses
`;

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '📸', color: 'from-pink-600 to-purple-600',   bestHour: 9  },
  { id: 'linkedin',  label: 'LinkedIn',  icon: '💼', color: 'from-blue-700 to-blue-500',     bestHour: 8  },
  { id: 'twitter',   label: 'Twitter/X', icon: '🐦', color: 'from-sky-600 to-cyan-500',      bestHour: 8  },
  { id: 'facebook',  label: 'Facebook',  icon: '📘', color: 'from-indigo-700 to-indigo-500', bestHour: 9  },
  { id: 'youtube',   label: 'YouTube',   icon: '▶️', color: 'from-red-700 to-red-500',       bestHour: 14 },
  { id: 'threads',   label: 'Threads',   icon: '🧵', color: 'from-gray-700 to-gray-500',     bestHour: 10 },
];

const DAILY_TOPICS = [
  'We build high-converting websites for growing businesses at Ayanix Tech',
  'Our 10-member team delivers projects in just 7-15 days',
  'Transparent pricing with no hidden costs — Ayanix Tech promise',
  'Direct founder communication — no middlemen, no delays at Ayanix Tech',
  'We helped another local business go digital with a stunning website',
  'SEO + Meta Ads + Website = complete digital growth package by Ayanix Tech',
  'From idea to live website in 15 days — Ayanix Tech delivers results',
  'Mobile apps, websites, custom software — Ayanix Tech builds it all',
];

const TONES = ['professional', 'inspirational', 'casual', 'funny'];

// ─── SVG Illustrations ───────────────────────────────────
const RobotSVG = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
    <rect x="35" y="40" width="50" height="45" rx="8" fill="#7C3AED"/>
    <rect x="45" y="50" width="14" height="10" rx="3" fill="#A78BFA"/>
    <rect x="61" y="50" width="14" height="10" rx="3" fill="#A78BFA"/>
    <rect x="47" y="67" width="26" height="8" rx="4" fill="#6D28D9"/>
    <rect x="50" y="70" width="6" height="3" rx="1" fill="#4ADE80"/>
    <rect x="57" y="70" width="6" height="3" rx="1" fill="#FACC15"/>
    <rect x="64" y="70" width="6" height="3" rx="1" fill="#F87171"/>
    <rect x="48" y="28" width="24" height="14" rx="6" fill="#8B5CF6"/>
    <rect x="58" y="22" width="4" height="8" rx="2" fill="#A78BFA"/>
    <rect x="20" y="48" width="15" height="8" rx="4" fill="#7C3AED"/>
    <rect x="85" y="48" width="15" height="8" rx="4" fill="#7C3AED"/>
    <rect x="40" y="85" width="12" height="20" rx="4" fill="#6D28D9"/>
    <rect x="68" y="85" width="12" height="20" rx="4" fill="#6D28D9"/>
    <circle cx="95" cy="25" r="8" fill="#4ADE80" opacity="0.8"/>
    <text x="91" y="29" fontSize="10" fill="white">✓</text>
  </svg>
);

const CalendarSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
    <rect x="10" y="20" width="80" height="70" rx="10" fill="#1E1B4B"/>
    <rect x="10" y="20" width="80" height="25" rx="10" fill="#4F46E5"/>
    <rect x="10" y="38" width="80" height="7" fill="#4F46E5"/>
    <rect x="20" y="10" width="8" height="18" rx="4" fill="#818CF8"/>
    <rect x="72" y="10" width="8" height="18" rx="4" fill="#818CF8"/>
    <circle cx="30" cy="60" r="6" fill="#4ADE80"/>
    <circle cx="50" cy="60" r="6" fill="#FACC15"/>
    <circle cx="70" cy="60" r="6" fill="#F87171"/>
    <circle cx="30" cy="78" r="6" fill="#60A5FA"/>
    <circle cx="50" cy="78" r="6" fill="#4ADE80"/>
    <circle cx="70" cy="78" r="6" fill="#818CF8"/>
  </svg>
);

const TrendSVG = () => (
  <svg viewBox="0 0 100 80" className="w-full h-full" fill="none">
    <rect x="0" y="0" width="100" height="80" rx="8" fill="#0F172A"/>
    <polyline points="10,65 30,45 50,50 70,25 90,15" stroke="#4ADE80" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="65" r="4" fill="#4ADE80"/>
    <circle cx="30" cy="45" r="4" fill="#4ADE80"/>
    <circle cx="50" cy="50" r="4" fill="#FACC15"/>
    <circle cx="70" cy="25" r="4" fill="#4ADE80"/>
    <circle cx="90" cy="15" r="4" fill="#4ADE80"/>
    <line x1="10" y1="70" x2="90" y2="70" stroke="#374151" strokeWidth="1"/>
    <line x1="10" y1="10" x2="10" y2="70" stroke="#374151" strokeWidth="1"/>
  </svg>
);

// ─── Main Component ───────────────────────────────────────
export default function AutoMode() {
  const [autoLog, setAutoLog]             = useState([]);
  const [isRunning, setIsRunning]         = useState(false);
  const [currentStep, setCurrentStep]     = useState('');
  const [generatedDay, setGeneratedDay]   = useState(null);
  const [posts, setPosts]                 = useState(() => {
    const saved = JSON.parse(localStorage.getItem('todaysPosts') || '{}');
    return saved.date === new Date().toDateString() ? saved.posts || {} : {};
  });
  const [posters, setPosters]             = useState({});
  const [autoEnabled, setAutoEnabled]     = useState(
    localStorage.getItem('autoModeEnabled') === 'true'
  );
  const [expandedPost, setExpandedPost]   = useState(null);
  const [savedToFirebase, setSavedToFirebase] = useState(false);
  const logRef   = useRef(null);
  const timerRef = useRef(null);

  // ── Helpers ──────────────────────────────────────────────
  const addLog = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString('en-IN');
    setAutoLog(prev => [...prev, { msg, type, time }]);
    setTimeout(() => logRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }), 100);
  };

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
    if (!data.choices?.[0]?.message?.content) throw new Error('empty');
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

  // ── Main Runner ───────────────────────────────────────────
  const runDailyAuto = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setSavedToFirebase(false);
    setAutoLog([]);
    setPosts({});
    setPosters({});

    addLog('🤖 Auto Mode shuru hua!', 'success');
    addLog('📰 Aaj ka trending topic fetch ho raha hai...', 'info');

    // Step 1: Trending topic
    let topic = '';
    try {
      const trending = await fetchTrendingTopics();
      if (trending?.length > 0) {
        topic = trending[0].title + (trending[0].description ? '. ' + trending[0].description : '');
        addLog(`📰 Trending topic mila: "${trending[0].title.slice(0, 60)}..."`, 'success');
      } else throw new Error('no trending');
    } catch {
      const idx = new Date().getDay();
      topic = DAILY_TOPICS[idx % DAILY_TOPICS.length];
      addLog(`💡 Fallback topic use ho raha hai`, 'warn');
    }

    // Step 2: Tone
    const tone = TONES[new Date().getDate() % TONES.length];
    addLog(`🎭 Aaj ka tone: ${tone}`, 'info');
    addLog('✍️ Sare platforms ke liye content generate ho raha hai...', 'info');

    const results   = {};
    const posterMap = {};

    // Step 3: Generate for each platform
    for (const platform of PLATFORMS) {
      setCurrentStep(`${platform.icon} ${platform.label} likh raha hoon...`);
      addLog(`${platform.icon} ${platform.label} — generating...`, 'info');

      const prompt = `You are a social media expert for a tech startup.
COMPANY INFO: ${AYANIX_CONTEXT}

TASK: Write a ${tone} social media post for ${platform.label.toUpperCase()} about: "${topic}"

IMPORTANT — Always mention at least one of these Ayanix Tech services:
Website Development, Mobile App Development, Custom Software, UI/UX Design, Meta Ads, SEO, E-Commerce

PLATFORM RULES:
- instagram: Engaging caption max 2200 chars + 15 relevant hashtags at end
- linkedin: Professional story max 1500 chars, 3-5 hashtags
- twitter: Punchy max 280 chars, 2-3 hashtags only
- facebook: Friendly max 500 chars
- youtube: Video description max 500 chars with keywords
- threads: Casual max 500 chars

Write ONLY the post content. No "Here is your post:" prefix.`;

      try {
        results[platform.id] = await callGroq(prompt);
        addLog(`✅ ${platform.label} — Groq se ready!`, 'success');
      } catch {
        try {
          results[platform.id] = await callGemini(prompt);
          addLog(`✅ ${platform.label} — Gemini se ready!`, 'success');
        } catch {
          results[platform.id] = '❌ AI unavailable';
          addLog(`❌ ${platform.label} — dono AI fail!`, 'error');
        }
      }

      // Step 4: Poster
      const shortText = topic.length > 55 ? topic.substring(0, 52) + '...' : topic;
      posterMap[platform.id] = generatePoster(shortText, platform.id);
      addLog(`🖼️ ${platform.label} — poster ready!`, 'success');

      await new Promise(r => setTimeout(r, 400));
    }

    setPosts(results);
    setPosters(posterMap);

    // Step 5: Save to localStorage
    const todayKey = new Date().toDateString();
    localStorage.setItem('todaysPosts', JSON.stringify({
      date: todayKey, topic, tone, posts: results
    }));
    setGeneratedDay(todayKey);
    addLog('💾 LocalStorage mein save ho gaya!', 'success');

    // Step 6: Save to Firebase Firestore
    addLog('☁️ Firebase Firestore mein save ho raha hai...', 'info');
    try {
      await addDoc(collection(db, 'posts'), {
        topic,
        tone,
        platforms: PLATFORMS.map(p => p.id),
        posts: results,
        status: 'scheduled',
        scheduledAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        source: 'auto',
        userId: auth.currentUser?.uid || 'anonymous',
        userEmail: auth.currentUser?.email || '',
      });
      addLog('✅ Firebase mein save ho gaya!', 'success');
      setSavedToFirebase(true);
    } catch (e) {
      addLog('⚠️ Firebase save fail: ' + e.message, 'warn');
    }

    setCurrentStep('');
    addLog('🎉 Sab kaam ho gaya! Content + Posters + Firebase — Done!', 'success');
    addLog('📅 Scheduled page pe check karo!', 'info');
    setIsRunning(false);
  };

  // ── Auto daily check ──────────────────────────────────────
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('todaysPosts') || '{}');
    if (saved.date === new Date().toDateString()) {
      setGeneratedDay(saved.date);
      setPosts(saved.posts || {});
      addLog('✅ Aaj ki posts already ban chuki hain (cache se load hui)', 'success');
    }

    if (autoEnabled) {
      // Check every hour
      timerRef.current = setInterval(() => {
        const s = JSON.parse(localStorage.getItem('todaysPosts') || '{}');
        if (s.date !== new Date().toDateString()) {
          addLog('🌅 Naya din! Auto generation shuru...', 'info');
          runDailyAuto();
        }
      }, 60 * 60 * 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [autoEnabled]);

  const toggleAuto = () => {
    const val = !autoEnabled;
    setAutoEnabled(val);
    localStorage.setItem('autoModeEnabled', String(val));
    addLog(val ? '✅ Auto Mode ON — roz subah generate hoga!' : '⏸️ Auto Mode OFF', val ? 'success' : 'warn');
  };

  const postColors = [
    'from-pink-900/40 to-purple-900/40',
    'from-blue-900/40 to-indigo-900/40',
    'from-sky-900/40 to-cyan-900/40',
    'from-indigo-900/40 to-blue-900/40',
    'from-red-900/40 to-orange-900/40',
    'from-gray-800/60 to-gray-900/60',
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <div className="relative bg-gradient-to-br from-purple-900 via-gray-900 to-gray-950 px-8 py-10 border-b border-gray-800 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-purple-600 opacity-10 rounded-full blur-3xl pointer-events-none"/>

        <div className="flex items-center justify-between max-w-5xl">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold">🤖 AI POWERED</span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                autoEnabled
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-gray-700 text-gray-400 border-gray-600'
              }`}>
                {autoEnabled ? '● LIVE' : '○ PAUSED'}
              </span>
              {savedToFirebase && (
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  ☁️ Firebase Saved
                </span>
              )}
            </div>

            <h1 className="text-4xl font-black mb-2 leading-tight">
              Zero Touch<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Social Media Automation
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-6 max-w-lg">
              Tum so jao — AI roz subah trending topics dhundh ke, posts likhega, posters banayega, Firebase mein save karega! 🚀
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <button onClick={toggleAuto}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all ${
                  autoEnabled
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}>
                {autoEnabled ? '✅ Auto Mode ON' : '⏸️ Auto Mode OFF'}
              </button>
              <button onClick={runDailyAuto} disabled={isRunning}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-bold transition shadow-lg shadow-purple-600/30">
                {isRunning
                  ? <><span className="animate-spin">⚙️</span> {currentStep || 'Running...'}</>
                  : <><span>▶️</span> Run Karo Abhi</>}
              </button>
            </div>
          </div>

          <div className="hidden lg:block w-48 h-48 flex-shrink-0">
            <RobotSVG />
          </div>
        </div>
      </div>

      <div className="px-8 py-8 max-w-5xl mx-auto">

        {/* ══ STATS ════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '🌐', label: 'Platforms',   value: '6',    sub: 'Instagram, LinkedIn...' },
            { icon: '📅', label: 'Posts / Day', value: '6',    sub: 'Roz ek har platform'    },
            { icon: '🤖', label: 'AI Models',   value: '2',    sub: 'Groq + Gemini fallback' },
            { icon: '☁️', label: 'Firebase',    value: 'Auto', sub: 'Cloud mein save hota'   },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-purple-500/50 transition">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-sm font-semibold text-gray-300">{s.label}</div>
              <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ══ HOW IT WORKS ═════════════════════════════════════ */}
        <div className="mb-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">⚡ Kaise Kaam Karta Hai</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step:'01', icon:'📰', title:'Trending Topic', desc:'NewsAPI se aaj ki hot news fetch',         color:'bg-blue-500'   },
              { step:'02', icon:'🤖', title:'AI Content',     desc:'Groq likhta hai, fail ho toh Gemini',    color:'bg-purple-500' },
              { step:'03', icon:'🖼️', title:'Unique Poster',  desc:'Canvas se naya design har baar',          color:'bg-pink-500'   },
              { step:'04', icon:'☁️', title:'Firebase Save',  desc:'Firestore mein auto save + schedule',     color:'bg-green-500'  },
            ].map(s => (
              <div key={s.step} className="relative bg-gray-800 rounded-xl p-4 border border-gray-700">
                <span className={`absolute top-3 right-3 text-xs font-black text-white ${s.color} w-7 h-7 rounded-full flex items-center justify-center`}>
                  {s.step}
                </span>
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="font-bold text-white text-sm mb-1">{s.title}</div>
                <div className="text-gray-400 text-xs">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ PLATFORM SCHEDULE ════════════════════════════════ */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <div className="w-8 h-8"><CalendarSVG /></div>
            Platform-wise Best Posting Schedule
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PLATFORMS.map(p => (
              <div key={p.id} className={`bg-gradient-to-br ${p.color} p-4 rounded-2xl border border-white/10 flex items-center gap-3`}>
                <span className="text-3xl">{p.icon}</span>
                <div>
                  <div className="font-bold text-white">{p.label}</div>
                  <div className="text-white/70 text-sm">⏰ Best: {String(p.bestHour).padStart(2,'0')}:00</div>
                  <div className="text-white/50 text-xs mt-0.5">Daily auto post</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ LIVE LOG ════════════════════════════════════════ */}
        {autoLog.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              🖥️ Live Activity Log
              {isRunning && (
                <span className="text-sm bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full animate-pulse border border-green-500/30">
                  ● Running
                </span>
              )}
              {savedToFirebase && (
                <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                  ☁️ Saved
                </span>
              )}
            </h2>
            <div ref={logRef}
              className="bg-black border border-gray-800 rounded-2xl p-5 h-56 overflow-y-auto font-mono text-sm">
              {autoLog.map((log, i) => (
                <div key={i} className={`mb-1.5 flex items-start gap-2 ${
                  log.type === 'success' ? 'text-green-400'
                  : log.type === 'error' ? 'text-red-400'
                  : log.type === 'warn'  ? 'text-yellow-400'
                  : 'text-gray-400'
                }`}>
                  <span className="text-gray-600 flex-shrink-0">[{log.time}]</span>
                  <span>{log.msg}</span>
                </div>
              ))}
              {isRunning && (
                <div className="text-purple-400 animate-pulse mt-1">▌ AI working...</div>
              )}
            </div>
          </div>
        )}

        {/* ══ GENERATED POSTS ════════════════════════════════ */}
        {Object.keys(posts).length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-8"><TrendSVG /></div>
              <div>
                <h2 className="text-xl font-bold text-green-400">✅ Aaj ke Posts Ready!</h2>
                <p className="text-gray-400 text-sm">
                  {generatedDay || new Date().toDateString()} — 6 platforms
                  {savedToFirebase && <span className="ml-2 text-blue-400">☁️ Firebase mein saved</span>}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {PLATFORMS.map((platform, idx) => {
                const content    = posts[platform.id];
                const poster     = posters[platform.id];
                const isExpanded = expandedPost === platform.id;
                if (!content) return null;

                return (
                  <div key={platform.id}
                    className={`bg-gradient-to-br ${postColors[idx]} border border-gray-700/50 rounded-2xl overflow-hidden hover:border-purple-500/40 transition`}>

                    {/* Platform Header */}
                    <div className={`bg-gradient-to-r ${platform.color} px-5 py-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <div>
                          <span className="font-bold text-white text-lg">{platform.label}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-white/70 text-xs">⏰ Best: {String(platform.bestHour).padStart(2,'0')}:00</span>
                            <span className="text-white/50 text-xs">• {content.length} chars</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => navigator.clipboard.writeText(content)}
                          className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm text-white font-medium transition">
                          📋 Copy
                        </button>
                        <button onClick={() => setExpandedPost(isExpanded ? null : platform.id)}
                          className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm text-white font-medium transition">
                          {isExpanded ? '▲ Less' : '▼ More'}
                        </button>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 flex gap-5">
                      <div className="flex-1">
                        <p className={`text-gray-200 text-sm leading-relaxed whitespace-pre-wrap ${!isExpanded ? 'line-clamp-4' : ''}`}>
                          {content}
                        </p>
                        {!isExpanded && content.length > 200 && (
                          <button onClick={() => setExpandedPost(platform.id)}
                            className="text-purple-400 text-xs mt-2 hover:text-purple-300">
                            Poora padhne ke liye click karo →
                          </button>
                        )}
                      </div>

                      {/* Poster */}
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        {poster ? (
                          <>
                            <div className="relative group">
                              <img src={poster} alt="AI Poster"
                                className="w-32 h-32 rounded-xl object-cover border-2 border-white/20 shadow-xl"/>
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl transition flex items-center justify-center">
                                <span className="text-white text-xs font-bold">AI Poster</span>
                              </div>
                            </div>
                            <a href={poster} download={`${platform.id}-${Date.now()}.png`}
                              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition border border-white/10">
                              ⬇️ Download
                            </a>
                            <button onClick={() => {
                              const shortText = Object.values(posts)[0]?.slice(0,52) || 'Ayanix Tech';
                              setPosters(prev => ({ ...prev, [platform.id]: generatePoster(shortText, platform.id) }));
                            }}
                              className="text-xs bg-purple-700/40 hover:bg-purple-700/60 text-white px-3 py-1 rounded-lg transition">
                              🎨 New Design
                            </button>
                          </>
                        ) : (
                          <div className="w-32 h-32 rounded-xl border border-gray-700 flex items-center justify-center text-4xl">
                            🖼️
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ NEXT STEP — API CONNECTIONS ════════════════════ */}
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/40 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="text-4xl">🔗</div>
            <div>
              <h3 className="text-lg font-bold text-blue-300">Next Step — Direct Auto Posting</h3>
              <p className="text-gray-400 text-sm mt-1">
                Posts generate + Firebase save ho rahi hain. Direct posting ke liye yeh APIs chahiye:
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon:'📸', name:'Instagram', api:'Meta Graph API',    status:'Business verify chahiye', diff:'medium' },
              { icon:'💼', name:'LinkedIn',  api:'LinkedIn API',      status:'Easy approval',           diff:'easy'   },
              { icon:'🐦', name:'Twitter/X', api:'Twitter API v2',    status:'Free tier available',     diff:'easy'   },
              { icon:'📘', name:'Facebook',  api:'Meta Graph API',    status:'Same as Instagram',       diff:'medium' },
              { icon:'▶️', name:'YouTube',   api:'YouTube Data API',  status:'Free & easy',             diff:'easy'   },
              { icon:'🧵', name:'Threads',   api:'Threads API (Meta)',status:'Beta access',             diff:'medium' },
            ].map(p => (
              <div key={p.name} className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{p.icon}</span>
                  <span className="font-bold text-white text-sm">{p.name}</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                    p.diff === 'easy'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {p.diff === 'easy' ? '✓ Easy' : '⚡ Medium'}
                  </span>
                </div>
                <div className="text-gray-400 text-xs">{p.api}</div>
                <div className="text-gray-500 text-xs mt-1">📌 {p.status}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-yellow-300 text-sm">
            💡 <strong>Suggestion:</strong> Pehle LinkedIn + Twitter se shuru karo — sabse fast approve karte hain!
          </div>
        </div>

      </div>
    </div>
  );
}