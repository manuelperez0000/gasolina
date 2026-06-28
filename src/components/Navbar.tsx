import type { Usuario } from '../types'

import { NavLink } from "react-router-dom"

interface NavbarProps {
  user: Usuario
  onLogout: () => void
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="navbar navbar-dark mb-4" style={{ backgroundColor: '#0d6efd' }}>
      <div className="container d-flex align-items-center">
        <span className="navbar-brand mb-0">Gasolina - ({user.rol})</span>

        <div className="ms-auto d-flex gap-2 align-items-center">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link-custom text-light ${isActive ? 'active' : ''}`}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/cajero"
            className={({ isActive }) => `nav-link-custom text-light ${isActive ? 'active' : ''}`}
          >
            Cajero
          </NavLink>

          <NavLink
            to="/usuarios"
            className={({ isActive }) => `nav-link-custom text-light ${isActive ? 'active' : ''}`}
          >
            Usuarios
          </NavLink>

          <button className="btn btn-light btn-sm" onClick={onLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  )
}
