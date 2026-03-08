import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">When Do I Quit?</h1>
        <p className="mt-2 text-gray-600">Sign in to your account</p>
      </div>
      <LoginForm />
    </div>
  );
}
