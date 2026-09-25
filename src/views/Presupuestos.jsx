import { useEffect, useMemo, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import Modal from '../components/Modal.jsx'

const ESTADOS = ['borrador', 'aprobado', 'facturado']

const emptyForm = {
  clienteId: '',
  trabajoEquipo: '',
  validoHasta: '',
  lineas: [],
}

function formatMoney(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(value)
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  const date = fecha.toDate ? fecha.toDate() : new Date(fecha)
  return date.toLocaleDateString('es-AR')
}

function precioFinalProducto(producto) {
  const costoMinimo = Math.min(...producto.proveedores.map((p) => p.precioCosto))
  return costoMinimo * (1 + producto.recargoPorcentaje / 100)
}

function calcularSubtotal(lineas) {
  return lineas.reduce((total, linea) => {
    if (linea.tipo === 'repuesto') {
      return total + Number(linea.cantidad || 0) * Number(linea.precioUnitario || 0)
    }
    return total + Number(linea.precio || 0)
  }, 0)
}

function validate(form) {
  const errors = {}
  if (!form.clienteId) errors.clienteId = 'Seleccioná un cliente'
  if (!form.validoHasta) errors.validoHasta = 'Requerido'
  if (form.lineas.length === 0) {
    errors.lineas = 'Agregá al menos una línea'
  } else {
    const lineaErrors = form.lineas.map((linea) => {
      if (linea.tipo === 'repuesto') {
        if (!linea.productoId) return 'Seleccioná un producto'
        if (!linea.cantidad || Number(linea.cantidad) <= 0) return 'Cantidad inválida'
        if (!linea.precioUnitario || Number(linea.precioUnitario) <= 0) return 'Precio inválido'
      } else {
        if (!linea.descripcion.trim()) return 'Descripción requerida'
        if (!linea.precio || Number(linea.precio) <= 0) return 'Precio inválido'
      }
      return null
    })
    if (lineaErrors.some(Boolean)) errors.lineasDetalle = lineaErrors
  }
  return errors
}

async function crearPresupuesto(payload) {
  const contadorRef = doc(db, 'contadores', 'presupuestos')
  const presupuestoRef = doc(collection(db, 'presupuestos'))

  await runTransaction(db, async (transaction) => {
    const contadorSnap = await transaction.get(contadorRef)
    const ultimoNumero = contadorSnap.exists() ? contadorSnap.data().ultimoNumero : 0
    const siguienteNumero = ultimoNumero + 1

    transaction.set(contadorRef, { ultimoNumero: siguienteNumero }, { merge: true })
    transaction.set(presupuestoRef, {
      ...payload,
      numero: siguienteNumero,
      fechaEmision: new Date(),
      estado: 'borrador',
    })
  })
}

export default function Presupuestos() {
  const [presupuestos, setPresupuestos] = useState([])
  const [clientes, setClientes] = useState([])
  const [servicios, setServicios] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const presupuestosQuery = query(collection(db, 'presupuestos'), orderBy('numero', 'desc'))
    return onSnapshot(presupuestosQuery, (snapshot) => {
      setPresupuestos(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const clientesQuery = query(collection(db, 'clientes'), orderBy('nombreRazonSocial'))
    return onSnapshot(clientesQuery, (snapshot) => {
      setClientes(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
    })
  }, [])

  useEffect(() => {
    const serviciosQuery = query(collection(db, 'servicios'), orderBy('codigo'))
    return onSnapshot(serviciosQuery, (snapshot) => {
      setServicios(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
    })
  }, [])

  useEffect(() => {
    const productosQuery = query(collection(db, 'productos'), orderBy('codigo'))
    return onSnapshot(productosQuery, (snapshot) => {
      setProductos(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
    })
  }, [])

  const clientesPorId = useMemo(
    () => Object.fromEntries(clientes.map((cliente) => [cliente.id, cliente])),
    [clientes],
  )

  const filteredPresupuestos = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return presupuestos
    return presupuestos.filter((presupuesto) => {
      const cliente = clientesPorId[presupuesto.clienteId]
      return (
        String(presupuesto.numero).includes(term) ||
        (cliente?.nombreRazonSocial ?? '').toLowerCase().includes(term)
      )
    })
  }, [presupuestos, clientesPorId, search])

  const subtotal = useMemo(() => calcularSubtotal(form.lineas), [form.lineas])

  const openCreateModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (presupuesto) => {
    setEditingId(presupuesto.id)
    setForm({
      clienteId: presupuesto.clienteId,
      trabajoEquipo: presupuesto.trabajoEquipo ?? '',
      validoHasta: presupuesto.validoHasta,
      lineas: presupuesto.lineas.map((linea) => ({ ...linea })),
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const addLineaRepuesto = () => {
    setForm((prev) => ({
      ...prev,
      lineas: [...prev.lineas, { tipo: 'repuesto', productoId: '', cantidad: '1', precioUnitario: '' }],
    }))
  }

  const addLineaServicio = () => {
    setForm((prev) => ({
      ...prev,
      lineas: [...prev.lineas, { tipo: 'servicio', servicioId: '', descripcion: '', precio: '' }],
    }))
  }

  const removeLinea = (index) => {
    setForm((prev) => ({ ...prev, lineas: prev.lineas.filter((_, i) => i !== index) }))
  }

  const updateLinea = (index, changes) => {
    setForm((prev) => ({
      ...prev,
      lineas: prev.lineas.map((linea, i) => (i === index ? { ...linea, ...changes } : linea)),
    }))
  }

  const handleProductoSeleccionado = (index, productoId) => {
    const producto = productos.find((p) => p.id === productoId)
    updateLinea(index, {
      productoId,
      precioUnitario: producto ? String(precioFinalProducto(producto)) : '',
    })
  }

  const handleServicioSeleccionado = (index, servicioId) => {
    if (!servicioId) {
      updateLinea(index, { servicioId: '', descripcion: '', precio: '' })
      return
    }
    const servicio = servicios.find((s) => s.id === servicioId)
    updateLinea(index, {
      servicioId,
      descripcion: servicio?.descripcion ?? '',
      precio: servicio ? String(servicio.precio) : '',
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSaving(true)
    try {
      const lineas = form.lineas.map((linea) =>
        linea.tipo === 'repuesto'
          ? {
              tipo: 'repuesto',
              productoId: linea.productoId,
              cantidad: Number(linea.cantidad),
              precioUnitario: Number(linea.precioUnitario),
            }
          : {
              tipo: 'servicio',
              servicioId: linea.servicioId || null,
              descripcion: linea.descripcion.trim(),
              precio: Number(linea.precio),
            },
      )
      const total = calcularSubtotal(lineas)
      const payload = {
        clienteId: form.clienteId,
        trabajoEquipo: form.trabajoEquipo.trim(),
        validoHasta: form.validoHasta,
        lineas,
        subtotal: total,
        iva: 0,
        total,
      }

      if (editingId) {
        await updateDoc(doc(db, 'presupuestos', editingId), payload)
      } else {
        await crearPresupuesto(payload)
      }
      setIsModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleEstadoChange = async (presupuesto, nuevoEstado) => {
    await updateDoc(doc(db, 'presupuestos', presupuesto.id), { estado: nuevoEstado })
  }

  const handleDelete = async (presupuesto) => {
    const confirmed = window.confirm(`¿Eliminar el presupuesto N.º ${presupuesto.numero}?`)
    if (!confirmed) return
    await deleteDoc(doc(db, 'presupuestos', presupuesto.id))
  }

  return (
    <div className="view view--presupuestos">
      <div className="view__header">
        <h1>Presupuestos</h1>
        <button type="button" className="btn btn--primary" onClick={openCreateModal}>
          Nuevo presupuesto
        </button>
      </div>

      <input
        type="search"
        className="search-input"
        placeholder="Buscar por número o cliente..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loading ? (
        <p>Cargando presupuestos...</p>
      ) : filteredPresupuestos.length === 0 ? (
        <p>No hay presupuestos cargados.</p>
      ) : (
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Emisión</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredPresupuestos.map((presupuesto) => (
                <tr key={presupuesto.id}>
                  <td>{String(presupuesto.numero).padStart(4, '0')}</td>
                  <td>{clientesPorId[presupuesto.clienteId]?.nombreRazonSocial ?? '—'}</td>
                  <td>{formatFecha(presupuesto.fechaEmision)}</td>
                  <td>{formatMoney(presupuesto.total)}</td>
                  <td>
                    <select
                      value={presupuesto.estado}
                      onChange={(event) => handleEstadoChange(presupuesto, event.target.value)}
                    >
                      {ESTADOS.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="table__actions">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      disabled={presupuesto.estado === 'facturado'}
                      onClick={() => openEditModal(presupuesto)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--danger"
                      disabled={presupuesto.estado !== 'borrador'}
                      onClick={() => handleDelete(presupuesto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <Modal title={editingId ? 'Editar presupuesto' : 'Nuevo presupuesto'} onClose={closeModal}>
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="clienteId">Cliente</label>
            <select id="clienteId" value={form.clienteId} onChange={handleChange('clienteId')}>
              <option value="">Seleccionar cliente...</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombreRazonSocial}
                </option>
              ))}
            </select>
            {errors.clienteId && <p className="error">{errors.clienteId}</p>}

            <label htmlFor="trabajoEquipo">Trabajo / equipo (opcional)</label>
            <input
              id="trabajoEquipo"
              placeholder="Ej: Tractor Pauny doble tracción"
              value={form.trabajoEquipo}
              onChange={handleChange('trabajoEquipo')}
            />

            <label htmlFor="validoHasta">Válido hasta</label>
            <input
              id="validoHasta"
              type="date"
              value={form.validoHasta}
              onChange={handleChange('validoHasta')}
            />
            {errors.validoHasta && <p className="error">{errors.validoHasta}</p>}

            <div className="lineas-fieldset">
              <span className="form__section-label">Líneas</span>
              {errors.lineas && <p className="error">{errors.lineas}</p>}

              {form.lineas.map((linea, index) => (
                <div className="linea-row" key={index}>
                  <span className="linea-row__tipo">
                    {linea.tipo === 'repuesto' ? 'Repuesto' : 'Servicio'}
                  </span>

                  {linea.tipo === 'repuesto' ? (
                    <>
                      <select
                        value={linea.productoId}
                        onChange={(event) => handleProductoSeleccionado(index, event.target.value)}
                      >
                        <option value="">Seleccionar producto...</option>
                        {productos.map((producto) => (
                          <option key={producto.id} value={producto.id}>
                            {producto.codigo} — {producto.descripcion}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Cantidad"
                        value={linea.cantidad}
                        onChange={(event) => updateLinea(index, { cantidad: event.target.value })}
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Precio unitario"
                        value={linea.precioUnitario}
                        onChange={(event) => updateLinea(index, { precioUnitario: event.target.value })}
                      />
                    </>
                  ) : (
                    <>
                      <select
                        value={linea.servicioId}
                        onChange={(event) => handleServicioSeleccionado(index, event.target.value)}
                      >
                        <option value="">Servicio libre (cargar manual)...</option>
                        {servicios.map((servicio) => (
                          <option key={servicio.id} value={servicio.id}>
                            {servicio.codigo} — {servicio.descripcion}
                          </option>
                        ))}
                      </select>
                      <input
                        placeholder="Descripción"
                        value={linea.descripcion}
                        onChange={(event) => updateLinea(index, { descripcion: event.target.value })}
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Precio"
                        value={linea.precio}
                        onChange={(event) => updateLinea(index, { precio: event.target.value })}
                      />
                    </>
                  )}

                  <button type="button" className="btn btn--ghost btn--danger" onClick={() => removeLinea(index)}>
                    Quitar
                  </button>
                  {errors.lineasDetalle?.[index] && <p className="error">{errors.lineasDetalle[index]}</p>}
                </div>
              ))}

              <div className="lineas-fieldset__actions">
                <button type="button" className="btn btn--ghost" onClick={addLineaRepuesto}>
                  + Agregar repuesto
                </button>
                <button type="button" className="btn btn--ghost" onClick={addLineaServicio}>
                  + Agregar servicio
                </button>
              </div>
            </div>

            <p className="presupuesto-subtotal">Subtotal: {formatMoney(subtotal)}</p>

            <div className="form__actions">
              <button type="button" className="btn btn--ghost" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
