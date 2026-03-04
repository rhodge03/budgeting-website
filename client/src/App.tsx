import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import IncomeRetirementPage from './pages/IncomeRetirementPage';
import BudgetingPage from './pages/BudgetingPage';
import ProjectionsPage from './pages/ProjectionsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppShell from './components/layout/AppShell';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/income-retirement" replace />} />
            <Route path="/income-retirement" element={<IncomeRetirementPage />} />
            <Route path="/budgeting" element={<BudgetingPage />} />
            <Route path="/projections" element={<ProjectionsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
