import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseConfig';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import Scheduled from './pages/Scheduled';
import AutoMode from './pages/AutoMode';
import Login from './pages/Login';
import ConnectAccounts from './pages/ConnectAccounts';

function App() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-spin">⚙️</div>
        <p className="text-purple-400 font-bold">Loading SocialAI...</p>
      </div>
    </div>
  );

  if (!user) return <Login />;

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-950 text-white">
        <Sidebar user={user} />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/create"    element={<CreatePost />} />
            <Route path="/scheduled" element={<Scheduled />} />
            <Route path="/auto"      element={<AutoMode />} />
            <Route path="*"          element={<Navigate to="/" />} />
            <Route path="/connect" element={<ConnectAccounts />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;