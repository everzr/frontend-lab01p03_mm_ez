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
    if (!model.nombre || !model.apellido || !model.puesto) {
      setError('Nombre, Apellido y Puesto son obligatorios')
      return
    }
    setLoading(true)
    try {
      if (id) {
        await api.update(id, model)
      } else {
        await api.create(model)
      }
      nav('/empleados')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>{id ? 'Editar' : 'Crear'} Empleado</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={submit}>
        <div>
          <label>Nombre: <input name="nombre" value={model.nombre} onChange={handleChange} /></label>
        </div>
        <div>
          <label>Apellido: <input name="apellido" value={model.apellido} onChange={handleChange} /></label>
        </div>
            <div>
              <label>Puesto:
                <select name="puesto" value={model.puesto} onChange={handleChange}>
                  <option value="">--Seleccione--</option>
                  {PUESTOS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
            </div>
        <div>
          <label>Salario: <input name="salario" value={model.salario} onChange={handleChange} /></label>
        </div>
        <div>
          <label>Estado: 
            <select name="estado" value={model.estado} onChange={handleChange}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </label>
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  )
}
