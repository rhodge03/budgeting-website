import SignupForm from '../components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Household Financial Planner</h1>
        <p className="mt-2 text-gray-600">Create your account</p>
      </div>
      <SignupForm />
    </div>
  );
}
