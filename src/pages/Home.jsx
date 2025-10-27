export default function Home() {
  return (
    <div className="container-fluid px-4 mt-4">
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="py-3">
          <h1 className="display-5 fw-bold">TecnoGlobal</h1>
          <p className="col-md-8 fs-4">Sistema de administración de empleados — gestiona registros, aplica filtros y consulta estadísticas.</p>
          <a className="btn btn-primary btn-lg" href="/empleados" role="button">Ver Empleados</a>
        </div>
      </div>
    </div>
  )
}
