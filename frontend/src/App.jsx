import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Roster from './pages/Roster'
import Rajdy from './pages/Rajdy'
import Kalendarz from './pages/Kalendarz'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/roster" element={
          <PrivateRoute><Roster /></PrivateRoute>
        } />
        <Route path="/rajdy" element={
          <PrivateRoute><Rajdy /></PrivateRoute>
        } />
        <Route path="/kalendarz" element={
          <PrivateRoute><Kalendarz /></PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/roster" />} />
      </Routes>
    </BrowserRouter>
  )
}