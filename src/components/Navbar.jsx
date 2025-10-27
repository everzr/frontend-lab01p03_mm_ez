import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const active = (p) => (pathname === p ? { fontWeight: 'bold' } : {})

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/" style={{ marginRight: 12, ...active('/') }}>Home</Link>
      <Link to="/empleados" style={{ marginRight: 12, ...active('/empleados') }}>Empleados</Link>
      <Link to="/empleados/nuevo" style={{ marginRight: 12, ...active('/empleados/nuevo') }}>Nuevo</Link>
      <Link to="/estadisticas" style={{ marginRight: 12, ...active('/estadisticas') }}>Estadísticas</Link>
    </nav>
  )
}
