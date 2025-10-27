export default function Home() {
  return (
    <div className="container-fluid px-4 mt-4">
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="py-3">
          <h1 className="display-5 fw-bold">TecnoGlobal</h1>
          <p className="col-md-8 fs-4">Sistema de administración de empleados.</p>
          <p className="col-md-8 fs-4">2022-MS-651 - Maicol Josué Monge Santamaría</p>
          <p className="col-md-8 fs-4">2022-ZR-650 - Ever Alexander Zamora Ramirez</p>
          <a className="btn btn-primary btn-lg" href="/empleados" role="button">Ver Empleados</a>
        </div>
      </div>
    </div>
  )
}
