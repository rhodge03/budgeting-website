import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function GuestBanner() {
  const isGuest = useAuthStore((s) => s.isGuest);
  const navigate = useNavigate();

  if (!isGuest) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-sm">
      <span className="text-amber-800">
        Guest mode — your data is saved locally on this device.
      </span>
      <button
        onClick={() => navigate('/signup')}
        className="text-amber-900 font-medium underline hover:text-amber-700"
      >
        Create an account to save across devices
      </button>
    </div>
  );
}
