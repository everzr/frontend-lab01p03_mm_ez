const BASE = 'http://localhost:8080/api/empleados'

async function getJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export const api = {
  list: () => getJSON(BASE),
  get: (id) => getJSON(`${BASE}/${id}`),
  create: (body) => fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
  update: (id, body) => fetch(`${BASE}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
  remove: (id) => fetch(`${BASE}/${id}`, { method: 'DELETE' }),
  filterByPuesto: (puesto) => getJSON(`${BASE}/filtro/puesto?puesto=${encodeURIComponent(puesto)}`),
  filterByEstado: (estado) => getJSON(`${BASE}/filtro/estado?estado=${encodeURIComponent(estado)}`),
  filterBySalarioMayor: (monto) => getJSON(`${BASE}/filtro/salario/mayor?monto=${encodeURIComponent(monto)}`),
  filterBySalarioMenor: (monto) => getJSON(`${BASE}/filtro/salario/menor?monto=${encodeURIComponent(monto)}`),
  estadisticas: () => getJSON(`${BASE}/estadisticas`),
}

export default api
