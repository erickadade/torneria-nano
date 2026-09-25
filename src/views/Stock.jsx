import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import Modal from '../components/Modal.jsx'

const NUEVO_PROVEEDOR = '__nuevo__'

const emptyProveedorRow = { proveedorId: '', precioCosto: '' }

const emptyForm = {
  codigo: '',
  codigoBarras: '',
  descripcion: '',
  stockActual: '',
  stockMinimo: '',
  recargoPorcentaje: '',
  proveedores: [{ ...emptyProveedorRow }],
}

const emptyNuevoProveedor = { nombre: '', cuit: '', contacto: '' }

function formatMoney(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(value)
}

function validate(form) {
  const errors = {}
  if (!form.codigo.trim()) errors.codigo = 'Requerido'
  if (!form.descripcion.trim()) errors.descripcion = 'Requerido'
  if (form.stockActual === '' || Number(form.stockActual) < 0) {
    errors.stockActual = 'Debe ser un número mayor o igual a 0'
  }
  if (form.stockMinimo === '' || Number(form.stockMinimo) < 0) {
    errors.stockMinimo = 'Debe ser un número mayor o igual a 0'
  }
  if (form.recargoPorcentaje === '' || Number(form.recargoPorcentaje) < 0) {
    errors.recargoPorcentaje = 'Debe ser un número mayor o igual a 0'
  }
  const proveedorErrors = form.proveedores.map((row) => {
    if (row.proveedorId === NUEVO_PROVEEDOR || !row.proveedorId) return 'Seleccioná un proveedor'
    if (!row.precioCosto || Number(row.precioCosto) <= 0) return 'Costo inválido'
    return null
  })
  if (proveedorErrors.some(Boolean)) {
    errors.proveedores = proveedorErrors
  }
  return errors
}

function precioFinal(producto) {
  const costoMinimo = Math.min(...producto.proveedores.map((p) => p.precioCosto))
  return costoMinimo * (1 + producto.recargoPorcentaje / 100)
}

export default function Stock() {
  const [productos, setProductos] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [nuevoProveedorIndex, setNuevoProveedorIndex] = useState(null)
  const [nuevoProveedor, setNuevoProveedor] = useState(emptyNuevoProveedor)
  const [creandoProveedor, setCreandoProveedor] = useState(false)

  useEffect(() => {
    const productosQuery = query(collection(db, 'productos'), orderBy('codigo'))
    const unsubscribe = onSnapshot(productosQuery, (snapshot) => {
      setProductos(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const proveedoresQuery = query(collection(db, 'proveedores'), orderBy('nombre'))
    const unsubscribe = onSnapshot(proveedoresQuery, (snapshot) => {
      setProveedores(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
    })
    return unsubscribe
  }, [])

  const filteredProductos = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return productos
    return productos.filter(
      (producto) =>
        producto.codigo.toLowerCase().includes(term) ||
        producto.descripcion.toLowerCase().includes(term),
    )
  }, [productos, search])

  const openCreateModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setNuevoProveedorIndex(null)
    setIsModalOpen(true)
  }

  const openEditModal = (producto) => {
    setEditingId(producto.id)
    setForm({
      codigo: producto.codigo,
      codigoBarras: producto.codigoBarras ?? '',
      descripcion: producto.descripcion,
      stockActual: String(producto.stockActual),
      stockMinimo: String(producto.stockMinimo),
      recargoPorcentaje: String(producto.recargoPorcentaje),
      proveedores: producto.proveedores.map((p) => ({
        proveedorId: p.proveedorId,
        precioCosto: String(p.precioCosto),
      })),
    })
    setErrors({})
    setNuevoProveedorIndex(null)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleProveedorRowChange = (index, field) => (event) => {
    const value = event.target.value
    if (field === 'proveedorId' && value === NUEVO_PROVEEDOR) {
      setNuevoProveedorIndex(index)
      setNuevoProveedor(emptyNuevoProveedor)
    }
    setForm((prev) => ({
      ...prev,
      proveedores: prev.proveedores.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }))
  }

  const addProveedorRow = () => {
    setForm((prev) => ({ ...prev, proveedores: [...prev.proveedores, { ...emptyProveedorRow }] }))
  }

  const removeProveedorRow = (index) => {
    setForm((prev) => ({ ...prev, proveedores: prev.proveedores.filter((_, i) => i !== index) }))
    if (nuevoProveedorIndex === index) setNuevoProveedorIndex(null)
  }

  const handleCrearProveedor = async () => {
    if (!nuevoProveedor.nombre.trim()) return
    setCreandoProveedor(true)
    try {
      const ref = await addDoc(collection(db, 'proveedores'), {
        nombre: nuevoProveedor.nombre.trim(),
        cuit: nuevoProveedor.cuit.trim(),
        contacto: nuevoProveedor.contacto.trim(),
      })
      setForm((prev) => ({
        ...prev,
        proveedores: prev.proveedores.map((row, i) =>
          i === nuevoProveedorIndex ? { ...row, proveedorId: ref.id } : row,
        ),
      }))
      setNuevoProveedorIndex(null)
    } finally {
      setCreandoProveedor(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSaving(true)
    try {
      const payload = {
        codigo: form.codigo.trim(),
        codigoBarras: form.codigoBarras.trim(),
        descripcion: form.descripcion.trim(),
        stockActual: Number(form.stockActual),
        stockMinimo: Number(form.stockMinimo),
        recargoPorcentaje: Number(form.recargoPorcentaje),
        proveedores: form.proveedores.map((row) => ({
          proveedorId: row.proveedorId,
          precioCosto: Number(row.precioCosto),
          ultimaCompra: new Date(),
        })),
      }
      if (editingId) {
        await updateDoc(doc(db, 'productos', editingId), payload)
      } else {
        await addDoc(collection(db, 'productos'), payload)
      }
      setIsModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (producto) => {
    const confirmed = window.confirm(`¿Eliminar "${producto.descripcion}"?`)
    if (!confirmed) return
    await deleteDoc(doc(db, 'productos', producto.id))
  }

  return (
    <div className="view view--stock">
      <div className="view__header">
        <h1>Stock</h1>
        <button type="button" className="btn btn--primary" onClick={openCreateModal}>
          Nuevo producto
        </button>
      </div>

      <input
        type="search"
        className="search-input"
        placeholder="Buscar por código o descripción..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loading ? (
        <p>Cargando productos...</p>
      ) : filteredProductos.length === 0 ? (
        <p>No hay productos cargados.</p>
      ) : (
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Stock actual</th>
                <th>Stock mínimo</th>
                <th>Precio final</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((producto) => {
                const stockBajo = producto.stockActual <= producto.stockMinimo
                return (
                  <tr key={producto.id}>
                    <td>{producto.codigo}</td>
                    <td>{producto.descripcion}</td>
                    <td className={stockBajo ? 'table__cell--warning' : undefined}>
                      {producto.stockActual}
                    </td>
                    <td>{producto.stockMinimo}</td>
                    <td>{formatMoney(precioFinal(producto))}</td>
                    <td className="table__actions">
                      <button type="button" className="btn btn--ghost" onClick={() => openEditModal(producto)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost btn--danger"
                        onClick={() => handleDelete(producto)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <Modal title={editingId ? 'Editar producto' : 'Nuevo producto'} onClose={closeModal}>
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="codigo">Código</label>
            <input id="codigo" value={form.codigo} onChange={handleChange('codigo')} />
            {errors.codigo && <p className="error">{errors.codigo}</p>}

            <label htmlFor="codigoBarras">Código de barras (opcional)</label>
            <input id="codigoBarras" value={form.codigoBarras} onChange={handleChange('codigoBarras')} />

            <label htmlFor="descripcion">Descripción</label>
            <input id="descripcion" value={form.descripcion} onChange={handleChange('descripcion')} />
            {errors.descripcion && <p className="error">{errors.descripcion}</p>}

            <label htmlFor="stockActual">Stock actual</label>
            <input
              id="stockActual"
              type="number"
              min="0"
              value={form.stockActual}
              onChange={handleChange('stockActual')}
            />
            {errors.stockActual && <p className="error">{errors.stockActual}</p>}

            <label htmlFor="stockMinimo">Stock mínimo</label>
            <input
              id="stockMinimo"
              type="number"
              min="0"
              value={form.stockMinimo}
              onChange={handleChange('stockMinimo')}
            />
            {errors.stockMinimo && <p className="error">{errors.stockMinimo}</p>}

            <label htmlFor="recargoPorcentaje">Recargo (%)</label>
            <input
              id="recargoPorcentaje"
              type="number"
              min="0"
              step="0.01"
              value={form.recargoPorcentaje}
              onChange={handleChange('recargoPorcentaje')}
            />
            {errors.recargoPorcentaje && <p className="error">{errors.recargoPorcentaje}</p>}

            <div className="proveedores-fieldset">
              <span className="form__section-label">Proveedores</span>
              {form.proveedores.map((row, index) => (
                <div className="proveedor-row" key={index}>
                  <select
                    value={row.proveedorId}
                    onChange={handleProveedorRowChange(index, 'proveedorId')}
                  >
                    <option value="">Seleccionar proveedor...</option>
                    {proveedores.map((proveedor) => (
                      <option key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombre}
                      </option>
                    ))}
                    <option value={NUEVO_PROVEEDOR}>+ Nuevo proveedor...</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Costo"
                    value={row.precioCosto}
                    onChange={handleProveedorRowChange(index, 'precioCosto')}
                  />
                  {form.proveedores.length > 1 && (
                    <button
                      type="button"
                      className="btn btn--ghost btn--danger"
                      onClick={() => removeProveedorRow(index)}
                    >
                      Quitar
                    </button>
                  )}

                  {nuevoProveedorIndex === index && (
                    <div className="proveedor-nuevo">
                      <input
                        placeholder="Nombre del proveedor"
                        value={nuevoProveedor.nombre}
                        onChange={(event) =>
                          setNuevoProveedor((prev) => ({ ...prev, nombre: event.target.value }))
                        }
                      />
                      <input
                        placeholder="CUIT (opcional)"
                        value={nuevoProveedor.cuit}
                        onChange={(event) =>
                          setNuevoProveedor((prev) => ({ ...prev, cuit: event.target.value }))
                        }
                      />
                      <input
                        placeholder="Contacto (opcional)"
                        value={nuevoProveedor.contacto}
                        onChange={(event) =>
                          setNuevoProveedor((prev) => ({ ...prev, contacto: event.target.value }))
                        }
                      />
                      <button
                        type="button"
                        className="btn btn--primary"
                        disabled={creandoProveedor}
                        onClick={handleCrearProveedor}
                      >
                        {creandoProveedor ? 'Creando...' : 'Crear proveedor'}
                      </button>
                    </div>
                  )}
                  {errors.proveedores?.[index] && <p className="error">{errors.proveedores[index]}</p>}
                </div>
              ))}
              <button type="button" className="btn btn--ghost" onClick={addProveedorRow}>
                + Agregar proveedor
              </button>
            </div>

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
