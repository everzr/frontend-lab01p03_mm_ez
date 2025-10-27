import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { PUESTOS } from '../constants'

const empty = {
  nombre: '',
  apellido: '',
  dui: '',
  telefono: '',
  correo: '',
  direccion: '',
  fecha_contratacion: '',
  puesto: '',
  salario: '',
  estado: 'Activo'
}

export default function EmpleadoForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const [model, setModel] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const data = await api.get(id)
          setModel(data)
        } catch (err) {
          setError(err.message)
        }
      })()
    }
  }, [id])

  const handleChange = (e) => setModel({ ...model, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    // basic validation
    if (!model.nombre || !model.apellido || !model.puesto || !model.fecha_contratacion) {
      setError('Nombre, Apellido, Puesto y Fecha de contratación son obligatorios')
      return
    }
    setLoading(true)
    try {
      // normalize salario to number-like string (backend expects numeric)
      const payload = { ...model }
      // ensure estado matches backend enum style: 'Activo' or 'Inactivo'
      if (payload.estado) {
        const s = String(payload.estado).trim()
        payload.estado = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
      }
      // ensure fecha_contratacion is in yyyy-mm-dd (input type=date returns this)
      // ensure salario is numeric if possible
      if (payload.salario !== undefined && payload.salario !== null && payload.salario !== '') {
        const num = Number(String(payload.salario).replace(/,/g, ''))
        if (!Number.isNaN(num)) payload.salario = num
        else payload.salario = payload.salario.toString()
      }
      if (id) {
        await api.update(id, payload)
      } else {
        await api.create(payload)
      }
      // success: navigate back to list
      nav('/empleados')
    } catch (err) {
      console.error('Error creating/updating empleado:', err)
      setError(err.message || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">{id ? 'Editar' : 'Crear'} Empleado</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={submit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre</label>
                <input className="form-control" name="nombre" value={model.nombre} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Apellido</label>
                <input className="form-control" name="apellido" value={model.apellido} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Puesto</label>
                <select className="form-select" name="puesto" value={model.puesto} onChange={handleChange}>
                  <option value="">--Seleccione--</option>
                  {PUESTOS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Salario</label>
                <input className="form-control" name="salario" value={model.salario} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Fecha de contratación</label>
                <input type="date" className="form-control" name="fecha_contratacion" value={model.fecha_contratacion || ''} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Estado</label>
                <select className="form-select" name="estado" value={model.estado} onChange={handleChange}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => window.history.back()}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
