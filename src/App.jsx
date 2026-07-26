import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './hooks/useAuth.jsx'
import Login from './views/Login.jsx'
import Stock from './views/Stock.jsx'
import Proveedores from './views/Proveedores.jsx'
import Servicios from './views/Servicios.jsx'
import Clientes from './views/Clientes.jsx'
import Presupuestos from './views/Presupuestos.jsx'

function AppLayout({ children }) {
  const { user } = useAuth()
  return (
    <>
      {user && <Header />}
      <main>{children}</main>
    </>
  )
}

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/stock"
          element={
            <ProtectedRoute>
              <Stock />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proveedores"
          element={
            <ProtectedRoute>
              <Proveedores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicios"
          element={
            <ProtectedRoute>
              <Servicios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/presupuestos"
          element={
            <ProtectedRoute>
              <Presupuestos />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/stock" replace />} />
        <Route path="*" element={<Navigate to="/stock" replace />} />
      </Routes>
    </AppLayout>
  )
}
