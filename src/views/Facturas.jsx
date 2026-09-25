import { useEffect, useMemo, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import Modal from '../components/Modal.jsx'

const MEDIOS_PAGO = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'cheque_digital', label: 'Cheque digital' },
  { value: 'debito', label: 'Débito' },
  { value: 'tarjeta_credito', label: 'Tarjeta de crédito' },
]

const ESTADOS_PAGO = ['pendiente', 'cobrado']

const emptyForm = {
  origen: 'sin_presupuesto',
  presupuestoId: '',
  clienteId: '',
  lineas: [],
  medioPago: '',
  fechaCobro: '',
  estadoPago: 'pendiente',
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

function calcularTotal(lineas) {
  return lineas.reduce((total, linea) => {
    if (linea.tipo === 'repuesto') {
      return total + Number(linea.cantidad || 0) * Number(linea.precioUnitario || 0)
    }
    return total + Number(linea.precio || 0)
  }, 0)
}

function requiereFechaCobro(medioPago) {
  return medioPago === 'cheque' || medioPago === 'cheque_digital'
}

function validate(form) {
  const errors = {}
  if (form.origen === 'con_presupuesto') {
    if (!form.presupuestoId) errors.presupuestoId = 'Seleccioná un presupuesto'
  } else {
    if (!form.clienteId) errors.clienteId = 'Seleccioná un cliente'
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
  }
  if (!form.medioPago) errors.medioPago = 'Seleccioná un medio de pago'
  if (requiereFechaCobro(form.medioPago) && !form.fechaCobro) {
    errors.fechaCobro = 'Requerido para cheque / cheque digital'
  }
  return errors
}

async function crearFactura(payload) {
  const contadorRef = doc(db, 'contadores', 'facturas')
  const facturaRef = doc(collection(db, 'facturas'))

  await runTransaction(db, async (transaction) => {
    const contadorSnap = await transaction.get(contadorRef)
    const ultimoNumero = contadorSnap.exists() ? contadorSnap.data().ultimoNumero : 0
    const siguienteNumero = ultimoNumero + 1

    transaction.set(contadorRef, { ultimoNumero: siguienteNumero }, { merge: true })
    transaction.set(facturaRef, {
      ...payload,
      numero: siguienteNumero,
      fechaEmision: new Date(),
      facturadoArca: false,
      tipoComprobante: null,
      cae: null,
      pdfUrl: null,
    })
  })

  if (payload.presupuestoId) {
    await updateDoc(doc(db, 'presupuestos', payload.presupuestoId), { estado: 'facturado' })
  }
}

export default function Facturas() {
  const [facturas, setFacturas] = useState([])
  const [presupuestos, setPresupuestos] = useState([])
  const [clientes, setClientes] = useState([])
  const [servicios, setServicios] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const facturasQuery = query(collection(db, 'facturas'), orderBy('numero', 'desc'))
    return onSnapshot(facturasQuery, (snapshot) => {
      setFacturas(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    return onSnapshot(collection(db, 'presupuestos'), (snapshot) => {
      setPresupuestos(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
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

  const presupuestosAprobados = useMemo(
    () => presupuestos.filter((presupuesto) => presupuesto.estado === 'aprobado'),
    [presupuestos],
  )

  const presupuestoSeleccionado = useMemo(
    () => presupuestos.find((p) => p.id === form.presupuestoId) ?? null,
    [presupuestos, form.presupuestoId],
  )

  const filteredFacturas = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return facturas
    return facturas.filter((factura) => {
      const cliente = clientesPorId[factura.clienteId]
      return (
        String(factura.numero).includes(term) ||
        (cliente?.nombreRazonSocial ?? '').toLowerCase().includes(term)
      )
    })
  }, [facturas, clientesPorId, search])

  const totalManual = useMemo(() => calcularTotal(form.lineas), [form.lineas])

  const openCreateModal = () => {
    setForm(emptyForm)
    setErrors({})
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleOrigenChange = (origen) => {
    setForm((prev) => ({ ...emptyForm, origen, medioPago: prev.medioPago }))
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

  const precioFinalProducto = (producto) => {
    const costoMinimo = Math.min(...producto.proveedores.map((p) => p.precioCosto))
    return costoMinimo * (1 + producto.recargoPorcentaje / 100)
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
      let payload
      if (form.origen === 'con_presupuesto') {
        payload = {
          presupuestoId: presupuestoSeleccionado.id,
          clienteId: presupuestoSeleccionado.clienteId,
          lineas: presupuestoSeleccionado.lineas,
          total: presupuestoSeleccionado.total,
        }
      } else {
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
        payload = {
          presupuestoId: null,
          clienteId: form.clienteId,
          lineas,
          total: calcularTotal(lineas),
        }
      }

      await crearFactura({
        ...payload,
        medioPago: form.medioPago,
        fechaCobro: requiereFechaCobro(form.medioPago) ? form.fechaCobro : null,
        estadoPago: form.estadoPago,
      })
      setIsModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleEstadoPagoChange = async (factura, nuevoEstado) => {
    await updateDoc(doc(db, 'facturas', factura.id), { estadoPago: nuevoEstado })
  }

  return (
    <div className="view view--facturas">
      <div className="view__header">
        <h1>Facturas</h1>
        <button type="button" className="btn btn--primary" onClick={openCreateModal}>
          Nueva factura
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
        <p>Cargando facturas...</p>
      ) : filteredFacturas.length === 0 ? (
        <p>No hay facturas cargadas.</p>
      ) : (
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Emisión</th>
                <th>Total</th>
                <th>Medio de pago</th>
                <th>Estado de pago</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacturas.map((factura) => (
                <tr key={factura.id}>
                  <td>{String(factura.numero).padStart(4, '0')}</td>
                  <td>{clientesPorId[factura.clienteId]?.nombreRazonSocial ?? '—'}</td>
                  <td>{formatFecha(factura.fechaEmision)}</td>
                  <td>{formatMoney(factura.total)}</td>
                  <td>{MEDIOS_PAGO.find((m) => m.value === factura.medioPago)?.label ?? factura.medioPago}</td>
                  <td>
                    <select
                      value={factura.estadoPago}
                      onChange={(event) => handleEstadoPagoChange(factura, event.target.value)}
                    >
                      {ESTADOS_PAGO.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <Modal title="Nueva factura" onClose={closeModal}>
          <form className="form" onSubmit={handleSubmit}>
            <span className="form__section-label">Origen</span>
            <div className="origen-toggle">
              <label>
                <input
                  type="radio"
                  name="origen"
                  checked={form.origen === 'sin_presupuesto'}
                  onChange={() => handleOrigenChange('sin_presupuesto')}
                />
                Sin presupuesto
              </label>
              <label>
                <input
                  type="radio"
                  name="origen"
                  checked={form.origen === 'con_presupuesto'}
                  onChange={() => handleOrigenChange('con_presupuesto')}
                />
                Desde un presupuesto aprobado
              </label>
            </div>

            {form.origen === 'con_presupuesto' ? (
              <>
                <label htmlFor="presupuestoId">Presupuesto aprobado</label>
                <select id="presupuestoId" value={form.presupuestoId} onChange={handleChange('presupuestoId')}>
                  <option value="">Seleccionar presupuesto...</option>
                  {presupuestosAprobados.map((presupuesto) => (
                    <option key={presupuesto.id} value={presupuesto.id}>
                      N.º {String(presupuesto.numero).padStart(4, '0')} —{' '}
                      {clientesPorId[presupuesto.clienteId]?.nombreRazonSocial ?? 'Cliente'} —{' '}
                      {formatMoney(presupuesto.total)}
                    </option>
                  ))}
                </select>
                {errors.presupuestoId && <p className="error">{errors.presupuestoId}</p>}

                {presupuestoSeleccionado && (
                  <div className="factura-resumen">
                    <p>Cliente: {clientesPorId[presupuestoSeleccionado.clienteId]?.nombreRazonSocial}</p>
                    <p>Líneas: {presupuestoSeleccionado.lineas.length}</p>
                    <p>Total: {formatMoney(presupuestoSeleccionado.total)}</p>
                  </div>
                )}
              </>
            ) : (
              <>
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

                      <button
                        type="button"
                        className="btn btn--ghost btn--danger"
                        onClick={() => removeLinea(index)}
                      >
                        Quitar
                      </button>
                      {errors.lineasDetalle?.[index] && (
                        <p className="error">{errors.lineasDetalle[index]}</p>
                      )}
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

                <p className="presupuesto-subtotal">Total: {formatMoney(totalManual)}</p>
              </>
            )}

            <label htmlFor="medioPago">Medio de pago</label>
            <select id="medioPago" value={form.medioPago} onChange={handleChange('medioPago')}>
              <option value="">Seleccionar...</option>
              {MEDIOS_PAGO.map((medio) => (
                <option key={medio.value} value={medio.value}>
                  {medio.label}
                </option>
              ))}
            </select>
            {errors.medioPago && <p className="error">{errors.medioPago}</p>}

            {requiereFechaCobro(form.medioPago) && (
              <>
                <label htmlFor="fechaCobro">Fecha de cobro</label>
                <input
                  id="fechaCobro"
                  type="date"
                  value={form.fechaCobro}
                  onChange={handleChange('fechaCobro')}
                />
                {errors.fechaCobro && <p className="error">{errors.fechaCobro}</p>}
              </>
            )}

            <label htmlFor="estadoPago">Estado de pago</label>
            <select id="estadoPago" value={form.estadoPago} onChange={handleChange('estadoPago')}>
              {ESTADOS_PAGO.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>

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
