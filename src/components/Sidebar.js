import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

const links = [
  { path: '/',          icon: '🏠', label: 'Dashboard'   },
  { path: '/create',    icon: '✍️', label: 'Create Post'  },
  { path: '/scheduled', icon: '📅', label: 'Scheduled'    },
  { path: '/auto',      icon: '🤖', label: 'Auto Mode'    },
];

export default function Sidebar({ user }) {
  const { pathname } = useLocation();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col h-full">
      <h1 className="text-xl font-bold text-purple-400 mb-6">🚀 SocialAI</h1>

      <div className="flex flex-col gap-2 flex-1">
        {links.map(l => (
          <Link key={l.path} to={l.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
              ${pathname === l.path
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:bg-gray-800'}`}>
            {l.icon} {l.label}
          </Link>
        ))}
      </div>

      {/* User info + logout */}
      <div className="border-t border-gray-800 pt-4 mt-4">
        <div className="flex items-center gap-3 mb-3">
          {user?.photoURL && (
            <img src={user.photoURL} alt="avatar"
              className="w-9 h-9 rounded-full border border-purple-500" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold truncate">{user?.displayName}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={() => signOut(auth)}
          className="w-full text-left px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg text-sm transition">
          🚪 Logout
        </button>
      </div>
    </div>
  );
}