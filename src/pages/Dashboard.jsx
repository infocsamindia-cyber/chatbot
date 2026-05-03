import { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'linkedin',  label: 'LinkedIn',  icon: '💼' },
  { id: 'twitter',   label: 'Twitter/X', icon: '🐦' },
  { id: 'facebook',  label: 'Facebook',  icon: '📘' },
  { id: 'youtube',   label: 'YouTube',   icon: '▶️' },
  { id: 'threads',   label: 'Threads',   icon: '🧵' },
];

export default function Dashboard() {
  const [stats, setStats]       = useState({ today: 0, scheduled: 0, posted: 0, total: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const q    = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      const todayStr = new Date().toDateString();
      const todayCount = data.filter(p =>
        p.createdAt && new Date(p.createdAt).toDateString() === todayStr
      ).length;

      setStats({
        today:     todayCount,
        scheduled: data.filter(p => p.status === 'scheduled').length,
        posted:    data.filter(p => p.status === 'posted').length,
        total:     data.length,
      });

      // BUG FIX: Show only 5 most recent posts in dashboard
      setRecentPosts(data.slice(0, 5));
    } catch (e) {
      console.error('Dashboard load error:', e);
    }
    setLoading(false);
  };

  const statCards = [
    { label: 'Posts Today',  value: loading ? '...' : stats.today,     icon: '📝', color: 'text-purple-400' },
    { label: 'Scheduled',    value: loading ? '...' : stats.scheduled,  icon: '📅', color: 'text-yellow-400' },
    { label: 'Posted',       value: loading ? '...' : stats.posted,     icon: '✅', color: 'text-green-400'  },
    { label: 'Total Posts',  value: loading ? '...' : stats.total,      icon: '🗂',  color: 'text-blue-400'   },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-gray-900 border-b border-gray-800 px-8 py-6">
        <h1 className="text-2xl font-black mb-1">🚀 Dashboard</h1>
        <p className="text-gray-400 text-sm">Ayanix Tech — Social Media Command Center</p>
      </div>

      <div className="p-8 max-w-5xl">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-purple-500/40 transition">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: '✍️', label: 'Create Post',      href: '/create'   },
              { icon: '🤖', label: 'Auto Mode',         href: '/auto'     },
              { icon: '📅', label: 'View Scheduled',    href: '/scheduled'},
              { icon: '🔗', label: 'Connect Accounts',  href: '/connect'  },
            ].map(a => (
              <a key={a.label} href={a.href}
                className="flex flex-col items-center gap-2 p-4 bg-gray-900 border border-gray-800 rounded-2xl hover:border-purple-500/50 hover:bg-gray-800 transition cursor-pointer">
                <span className="text-3xl">{a.icon}</span>
                <span className="text-sm text-gray-300 font-medium">{a.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Platform Status */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">🌐 Platforms</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {PLATFORMS.map(p => {
              const isConnected =
                p.id === 'twitter'
                  ? true
                  : !!localStorage.getItem(`${p.id}_access_token`);
              return (
                <div key={p.id}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition ${
                    isConnected
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-gray-900 border-gray-800'
                  }`}>
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-xs text-gray-400">{p.label}</span>
                  <span className={`text-xs font-bold ${isConnected ? 'text-green-400' : 'text-gray-600'}`}>
                    {isConnected ? '● Live' : '○ Off'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">🕒 Recent Posts</h2>
            <a href="/scheduled" className="text-purple-400 text-sm hover:text-purple-300">
              Sab dekho →
            </a>
          </div>

          {loading && (
            <div className="text-center py-10 text-gray-400">
              <span className="animate-spin inline-block text-2xl">⚙️</span>
              <p className="mt-2 text-sm">Load ho raha hai...</p>
            </div>
          )}

          {!loading && recentPosts.length === 0 && (
            <div className="text-center py-10 bg-gray-900 border border-gray-800 rounded-2xl">
              <p className="text-gray-400 text-sm">Abhi tak koi post nahi bana. Create Post se shuru karo!</p>
            </div>
          )}

          {!loading && recentPosts.map(post => {
            const status = post.status || 'draft';
            return (
              <div key={post.id}
                className="mb-3 bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-purple-500/40 transition">
                <div className="flex gap-1 flex-shrink-0">
                  {(post.platforms || []).slice(0, 3).map(pid => {
                    const p = PLATFORMS.find(x => x.id === pid);
                    return <span key={pid} className="text-lg">{p?.icon || '📱'}</span>;
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{post.topic || 'Untitled'}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {post.createdAt ? new Date(post.createdAt).toLocaleString('en-IN') : '—'}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                  status === 'posted'    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}>
                  {status === 'posted' ? '✅ Posted' : status === 'scheduled' ? '⏰ Scheduled' : '📋 Draft'}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}