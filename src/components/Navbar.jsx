import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const isActive = (p) => (pathname === p ? 'nav-link active' : 'nav-link')

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">TecnoGlobal</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className={isActive('/')}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/empleados" className={isActive('/empleados')}>Empleados</Link>
            </li>
            <li className="nav-item">
              <Link to="/empleados/nuevo" className={isActive('/empleados/nuevo')}>Nuevo</Link>
            </li>
            <li className="nav-item">
              <Link to="/estadisticas" className={isActive('/estadisticas')}>Estadísticas</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
