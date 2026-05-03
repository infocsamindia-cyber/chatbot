import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/firebaseConfig';
import {
  collection, getDocs, deleteDoc,
  doc, query, orderBy, updateDoc
} from 'firebase/firestore';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '📸', color: 'from-pink-600 to-purple-600'  },
  { id: 'linkedin',  label: 'LinkedIn',  icon: '💼', color: 'from-blue-700 to-blue-500'    },
  { id: 'twitter',   label: 'Twitter/X', icon: '🐦', color: 'from-sky-600 to-cyan-500'     },
  { id: 'facebook',  label: 'Facebook',  icon: '📘', color: 'from-indigo-700 to-indigo-500' },
  { id: 'youtube',   label: 'YouTube',   icon: '▶️', color: 'from-red-700 to-red-500'       },
  { id: 'threads',   label: 'Threads',   icon: '🧵', color: 'from-gray-700 to-gray-500'    },
];

const STATUS_COLORS = {
  scheduled: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  posted:    'bg-green-500/20  text-green-400  border-green-500/30',
  failed:    'bg-red-500/20    text-red-400    border-red-500/30',
  draft:     'bg-gray-500/20   text-gray-400   border-gray-500/30',
};

export default function Scheduled() {
  const [posts, setPosts]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [view, setView]             = useState('list');
  const [expandedId, setExpandedId] = useState(null);
  const [stats, setStats]           = useState({ total: 0, scheduled: 0, posted: 0, draft: 0 });

  // BUG FIX: Wrap loadPosts in useCallback so it can safely be listed
  // in useEffect deps without causing infinite loops.
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const q    = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPosts(data);
      setStats({
        total:     data.length,
        scheduled: data.filter(p => p.status === 'scheduled').length,
        posted:    data.filter(p => p.status === 'posted').length,
        draft:     data.filter(p => p.status === 'draft' || !p.status).length,
      });
    } catch (e) {
      console.error('loadPosts error:', e);
    }
    setLoading(false);
  }, []);

  // BUG FIX: Original had `useEffect(() => { loadPosts(); }, [])` which caused
  // an eslint exhaustive-deps warning AND a potential stale-closure issue.
  // Now loadPosts is stable (useCallback with no deps) so it's safe to include.
  useEffect(() => { loadPosts(); }, [loadPosts]);

  const deletePost = async (id) => {
    if (!window.confirm('Delete karna chahte ho?')) return;
    await deleteDoc(doc(db, 'posts', id));
    loadPosts();
  };

  const markPosted = async (id) => {
    await updateDoc(doc(db, 'posts', id), {
      status:   'posted',
      postedAt: new Date().toISOString(),
    });
    loadPosts();
  };

  // BUG FIX: filter by status — original 'draft' filter missed posts where status is undefined.
  // Now normalise status to 'draft' before comparing.
  const filtered = filter === 'all'
    ? posts
    : posts.filter(p => (p.status || 'draft') === filter);

  const byDate = filtered.reduce((acc, p) => {
    const date = p.scheduledAt
      ? new Date(p.scheduledAt).toDateString()
      : new Date(p.createdAt).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(p);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-950 border-b border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">📅 Scheduled Posts</h1>
            <p className="text-gray-400 text-sm mt-1">Sare posts ka history aur schedule</p>
          </div>
          <button onClick={loadPosts}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm transition">
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="px-8 py-6 max-w-6xl">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Posts', value: stats.total,     icon: '📝' },
            { label: 'Scheduled',   value: stats.scheduled, icon: '⏰' },
            { label: 'Posted',      value: stats.posted,    icon: '✅' },
            { label: 'Drafts',      value: stats.draft,     icon: '📋' },
          ].map(s => (
            <div key={s.label}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-purple-500/40 transition">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-3xl font-black">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter + View Toggle */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {['all', 'scheduled', 'posted', 'draft'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition border ${
                  filter === f
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-purple-500'
                }`}>
                {f === 'all'        ? '🗂 All'
                : f === 'scheduled' ? '⏰ Scheduled'
                : f === 'posted'    ? '✅ Posted'
                : '📋 Draft'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {['list', 'calendar'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-2 rounded-xl text-sm transition ${
                  view === v ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                {v === 'list' ? '☰ List' : '📅 Calendar'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-4xl animate-spin mb-4">⚙️</div>
            <p className="text-gray-400">Posts load ho rahi hain...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-white font-bold text-lg mb-2">Koi post nahi mili</p>
            <p className="text-gray-400 text-sm">Create Post ya Auto Mode se posts generate karo</p>
          </div>
        )}

        {/* LIST VIEW */}
        {!loading && view === 'list' && filtered.map(post => {
          const isExpanded = expandedId === post.id;
          const status     = post.status || 'draft';
          const platforms  = post.platforms || [];

          return (
            <div key={post.id}
              className="mb-4 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/40 transition">

              <div className="p-5 flex items-start gap-4">

                {/* Platform icons */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {platforms.slice(0, 3).map(pid => {
                    const p = PLATFORMS.find(x => x.id === pid);
                    return <span key={pid} className="text-xl">{p?.icon || '📱'}</span>;
                  })}
                  {platforms.length > 3 && (
                    <span className="text-xs text-gray-500">+{platforms.length - 3}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[status] || STATUS_COLORS.draft}`}>
                      {status === 'scheduled' ? '⏰ Scheduled'
                       : status === 'posted'  ? '✅ Posted'
                       : status === 'failed'  ? '❌ Failed'
                       : '📋 Draft'}
                    </span>
                    {post.tone && (
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                        🎭 {post.tone}
                      </span>
                    )}
                    {post.scheduledAt && (
                      <span className="text-xs text-gray-500">
                        ⏰ {new Date(post.scheduledAt).toLocaleString('en-IN')}
                      </span>
                    )}
                    {post.source === 'auto' && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                        🤖 Auto
                      </span>
                    )}
                  </div>
                  <p className="text-white font-medium text-sm truncate">{post.topic}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {post.createdAt ? new Date(post.createdAt).toLocaleString('en-IN') : '—'}
                    {' • '}{platforms.length} platforms
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setExpandedId(isExpanded ? null : post.id)}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition">
                    {isExpanded ? '▲' : '▼'}
                  </button>
                  {status !== 'posted' && (
                    <button onClick={() => markPosted(post.id)}
                      className="px-3 py-1.5 bg-green-700 hover:bg-green-600 rounded-lg text-sm transition"
                      title="Mark as Posted">
                      ✅
                    </button>
                  )}
                  <button onClick={() => deletePost(post.id)}
                    className="px-3 py-1.5 bg-red-900 hover:bg-red-800 rounded-lg text-sm transition"
                    title="Delete">
                    🗑️
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && post.posts && (
                <div className="border-t border-gray-800 p-5">
                  <h4 className="text-sm font-bold text-gray-400 mb-3">📝 Generated Content:</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(post.posts).map(([pid, content]) => {
                      const p = PLATFORMS.find(x => x.id === pid);
                      // BUG FIX: Also guard against empty-string content, not just falsy
                      if (!p || !content) return null;
                      return (
                        <div key={pid} className="bg-gray-800 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm">{p.icon} {p.label}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(content)}
                              className="text-xs bg-purple-700 hover:bg-purple-600 px-2 py-1 rounded-lg transition">
                              📋 Copy
                            </button>
                          </div>
                          <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">{content}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* CALENDAR VIEW */}
        {!loading && view === 'calendar' && (
          <div>
            {Object.entries(byDate).length === 0 && (
              <div className="text-center py-20 text-gray-400">Koi posts nahi</div>
            )}
            {Object.entries(byDate).map(([date, datePosts]) => (
              <div key={date} className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-600 rounded-xl px-4 py-2">
                    <p className="text-white font-black text-sm">{date}</p>
                  </div>
                  <div className="flex-1 h-px bg-gray-800" />
                  <span className="text-gray-500 text-xs">{datePosts.length} posts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                  {datePosts.map(post => {
                    const status = post.status || 'draft';
                    return (
                      <div key={post.id}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-purple-500/40 transition">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[status] || STATUS_COLORS.draft}`}>
                            {status === 'posted'    ? '✅ Posted'
                             : status === 'scheduled' ? '⏰ Scheduled'
                             : '📋 Draft'}
                          </span>
                          {post.source === 'auto' && (
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                              🤖 Auto
                            </span>
                          )}
                        </div>
                        <p className="text-white text-sm font-medium truncate">{post.topic}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex gap-1">
                            {(post.platforms || []).slice(0, 4).map(pid => {
                              const p = PLATFORMS.find(x => x.id === pid);
                              return <span key={pid} className="text-base">{p?.icon}</span>;
                            })}
                          </div>
                          <div className="flex gap-1">
                            {status !== 'posted' && (
                              <button onClick={() => markPosted(post.id)}
                                className="text-xs bg-green-700 hover:bg-green-600 px-2 py-1 rounded-lg transition">
                                ✅
                              </button>
                            )}
                            <button onClick={() => deletePost(post.id)}
                              className="text-xs bg-red-900 hover:bg-red-800 px-2 py-1 rounded-lg transition">
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}