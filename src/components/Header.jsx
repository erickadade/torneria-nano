import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

const links = [
  { to: '/stock', label: 'Stock' },
  { to: '/proveedores', label: 'Proveedores' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/presupuestos', label: 'Presupuestos' },
]

export default function Header() {
  const { logout } = useAuth()

  return (
    <header className="header">
      <span className="header__brand">Tornería</span>
      <nav className="header__nav">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button type="button" onClick={logout}>
        Cerrar sesión
      </button>
    </header>
  )
}
