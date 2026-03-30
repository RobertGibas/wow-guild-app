import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login'
import Roster from './pages/Roster'

function PrivateRoute({children}){
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/roster" element={
        <PrivateRoute>
          <Roster/>
        </PrivateRoute>
      } />
      <Route path="/" element={<Navigate to="/roster"/>}/>
    </Routes>
    </BrowserRouter>
  )
}
