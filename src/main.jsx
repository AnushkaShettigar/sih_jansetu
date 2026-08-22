import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './login.jsx'
import AdminDashboard from './adminDashboard.jsx'
import ReportComplaint from './pages/ReportComplaint'
import ExploreReports from './pages/ExploreReports'
import ComplaintDetails from './pages/ComplaintDetails'
import ContactUs from './pages/ContactUs'
import AuthorityDashboard from './pages/AuthorityDashboard'
import Settings from './pages/Settings'
import { getDemoUser, isDemoAuthenticated } from './auth'

function ProtectedRoute({ children }) {
  return isDemoAuthenticated() ? children : <Navigate to="/login" replace />
}

function RoleRoute({ role, children }) {
  const user = getDemoUser()
  if (user?.role === role) return children
  return <Navigate to={user?.role === 'Authority' ? '/authority' : user?.role === 'Admin' ? '/admin' : '/'} replace />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
        <Route path="/report-complaint" element={<ProtectedRoute><ReportComplaint /></ProtectedRoute>} />
        <Route path="/explore-reports" element={<ProtectedRoute><ExploreReports /></ProtectedRoute>} />
        <Route path="/complaint/:id" element={<ProtectedRoute><ComplaintDetails /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><RoleRoute role="Admin"><AdminDashboard /></RoleRoute></ProtectedRoute>} />
        <Route path="/authority" element={<ProtectedRoute><RoleRoute role="Authority"><AuthorityDashboard /></RoleRoute></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
