import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import isotype from '../assets/isotype.svg'

const links = [
  { to: '/stock', label: 'Stock' },
  { to: '/proveedores', label: 'Proveedores' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/presupuestos', label: 'Presupuestos' },
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
            <NavLink key={link.to} to={link.to}>
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
            <NavLink key={link.to} to={link.to} onClick={closeMenu}>
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
