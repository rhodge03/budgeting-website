import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { hasGuestData } from '../services/guestStorage';

export default function LandingPage() {
  const enterGuestMode = useAuthStore((s) => s.enterGuestMode);
  const navigate = useNavigate();
  const hasExisting = hasGuestData();

  const handleTryFree = () => {
    enterGuestMode();
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage: 'url(/money_background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">When Do I Quit?</h1>
        <p className="text-gray-600 mb-8">
          Plan your household finances and see when you can retire.
        </p>

        <button
          onClick={handleTryFree}
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 transition-colors mb-4"
        >
          {hasExisting ? 'Continue Where You Left Off' : 'Try It Free — No Account Needed'}
        </button>

        <div className="flex justify-center gap-6 text-sm">
          <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign In
          </Link>
          <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
