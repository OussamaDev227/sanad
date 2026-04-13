import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/index.js'
import MainLayout from './components/layout/MainLayout.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import ServiceDetailPage from './pages/ServiceDetailPage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import RequestsPage from './pages/RequestsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import AdminPage from './pages/AdminPage.jsx'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected — inside MainLayout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
