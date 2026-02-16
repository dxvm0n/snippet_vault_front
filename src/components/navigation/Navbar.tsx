import { NavLink } from 'react-router-dom'
import './Navbar.css'

const menuItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Crear Snippet', path: '/snippets' },
  { label: 'Lenguajes', path: '/languages' },
  { label: 'Tags', path: '/tags' },
  { label: 'Favoritos', path: '/favorites' },
]

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <h1 className="navbar__brand">
          <span className="navbar__brand-mark">⌬</span>
          <span className="navbar__brand-text">Snippet Vault</span>
        </h1>

        <nav className="navbar__nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
              end={item.path === '/'}
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <NavLink className="navbar__cta" to="/snippets">
          Nuevo Snippet
        </NavLink>
      </div>
    </header>
  )
}

export default Navbar
