import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebaseConfig';

export default function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      alert('Login failed: ' + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center max-w-md w-full">

        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-3xl font-black text-white mb-2">SocialAI</h1>
        <p className="text-purple-400 font-bold mb-1">by Ayanix Tech</p>
        <p className="text-gray-400 text-sm mb-8">
          AI-powered social media automation — zero touch, full auto
        </p>

        <button onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-4 px-6 rounded-xl hover:bg-gray-100 transition text-lg">
          <img src="https://www.google.com/favicon.ico" alt="G" className="w-6 h-6"/>
          Continue with Google
        </button>

        <p className="text-gray-600 text-xs mt-6">
          Only Ayanix Tech team members can access this tool
        </p>
      </div>
    </div>
  );
}