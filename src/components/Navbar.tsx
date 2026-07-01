import { AiFillDashboard } from 'react-icons/ai'
import type { Usuario } from '../types'

import { NavLink } from "react-router-dom"
import { RiAccountBoxLine, RiHistoryFill } from 'react-icons/ri'
import { IoPeople } from 'react-icons/io5'
import { FaSignOutAlt } from 'react-icons/fa'

interface NavbarProps {
  user: Usuario
  onLogout: () => void
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="navbar navbar-dark" style={{ backgroundColor: '#30474e' }}>
      <div className="container d-flex align-items-center">
        <span className="navbar-brand mb-0">PDV</span>

        <div className="ms-auto d-flex gap-2 align-items-center">
          {user.rol === 'admin' && (<>
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link-custom text-light ${isActive ? 'active' : ''}`}
            >
              <AiFillDashboard />
            </NavLink>
            <NavLink
              to="/historial"
              className={({ isActive }) => `nav-link-custom text-light ${isActive ? 'active' : ''}`}
            >
              <RiHistoryFill />
            </NavLink>
            <NavLink
              to="/usuarios"
              className={({ isActive }) => `nav-link-custom text-light ${isActive ? 'active' : ''}`}
            >
              <IoPeople />
            </NavLink>
          </>
          )}

          <NavLink
            to="/cajero"
            className={({ isActive }) => `nav-link-custom text-light ${isActive ? 'active' : ''}`}
          >
            <RiAccountBoxLine />
          </NavLink>





          <button className="btn btn-danger btn-sm" onClick={onLogout}>
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </nav>
  )
}
