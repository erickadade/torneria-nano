import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import isotype from '../assets/isotype.svg'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/presupuestos', label: 'Presupuestos' },
  { to: '/stock', label: 'Stock' },
  { to: '/facturas', label: 'Facturas' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/proveedores', label: 'Proveedores' },
]

export default function Header() {
  const { logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="header">
      <div className="header__bar">
        <span className="header__brand">
          <img src={isotype} alt="" width="28" height="28" />
          Tornería Nano
        </span>

        <button
          type="button"
          className="header__toggle"
          aria-label="Abrir menú"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="header__nav header__nav--desktop">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="header__logout header__logout--desktop" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      {isMenuOpen && (
        <nav className="header__nav header__nav--mobile">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} onClick={closeMenu}>
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            className="header__logout"
            onClick={() => {
              closeMenu()
              logout()
            }}
          >
            Cerrar sesión
          </button>
        </nav>
      )}
    </header>
  )
}
