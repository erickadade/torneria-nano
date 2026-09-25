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

const emptyForm = { nombre: '', cuit: '', contacto: '' }

function validate(form) {
  const errors = {}
  if (!form.nombre.trim()) errors.nombre = 'Requerido'
  return errors
}

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const proveedoresQuery = query(collection(db, 'proveedores'), orderBy('nombre'))
    return onSnapshot(proveedoresQuery, (snapshot) => {
      setProveedores(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    return onSnapshot(collection(db, 'productos'), (snapshot) => {
      setProductos(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
    })
  }, [])

  const productosPorProveedor = useMemo(() => {
    const counts = {}
    for (const producto of productos) {
      for (const p of producto.proveedores ?? []) {
        counts[p.proveedorId] = (counts[p.proveedorId] ?? 0) + 1
      }
    }
    return counts
  }, [productos])

  const filteredProveedores = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return proveedores
    return proveedores.filter(
      (proveedor) =>
        proveedor.nombre.toLowerCase().includes(term) ||
        (proveedor.cuit ?? '').toLowerCase().includes(term),
    )
  }, [proveedores, search])

  const openCreateModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (proveedor) => {
    setEditingId(proveedor.id)
    setForm({
      nombre: proveedor.nombre,
      cuit: proveedor.cuit ?? '',
      contacto: proveedor.contacto ?? '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSaving(true)
    try {
      const payload = {
        nombre: form.nombre.trim(),
        cuit: form.cuit.trim(),
        contacto: form.contacto.trim(),
      }
      if (editingId) {
        await updateDoc(doc(db, 'proveedores', editingId), payload)
      } else {
        await addDoc(collection(db, 'proveedores'), payload)
      }
      setIsModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (proveedor) => {
    const cantidadProductos = productosPorProveedor[proveedor.id] ?? 0
    const mensaje =
      cantidadProductos > 0
        ? `Este proveedor está cargado en ${cantidadProductos} producto${cantidadProductos > 1 ? 's' : ''}. ¿Eliminar "${proveedor.nombre}" igual?`
        : `¿Eliminar "${proveedor.nombre}"?`
    const confirmed = window.confirm(mensaje)
    if (!confirmed) return
    await deleteDoc(doc(db, 'proveedores', proveedor.id))
  }

  return (
    <div className="view view--proveedores">
      <div className="view__header">
        <h1>Proveedores</h1>
        <button type="button" className="btn btn--primary" onClick={openCreateModal}>
          Nuevo proveedor
        </button>
      </div>

      <input
        type="search"
        className="search-input"
        placeholder="Buscar por nombre o CUIT..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loading ? (
        <p>Cargando proveedores...</p>
      ) : filteredProveedores.length === 0 ? (
        <p>No hay proveedores cargados.</p>
      ) : (
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>CUIT</th>
                <th>Contacto</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProveedores.map((proveedor) => (
                <tr key={proveedor.id}>
                  <td>{proveedor.nombre}</td>
                  <td>{proveedor.cuit || '—'}</td>
                  <td>{proveedor.contacto || '—'}</td>
                  <td className="table__actions">
                    <button type="button" className="btn btn--ghost" onClick={() => openEditModal(proveedor)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--danger"
                      onClick={() => handleDelete(proveedor)}
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
        <Modal title={editingId ? 'Editar proveedor' : 'Nuevo proveedor'} onClose={closeModal}>
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" value={form.nombre} onChange={handleChange('nombre')} />
            {errors.nombre && <p className="error">{errors.nombre}</p>}

            <label htmlFor="cuit">CUIT (opcional)</label>
            <input id="cuit" value={form.cuit} onChange={handleChange('cuit')} />

            <label htmlFor="contacto">Contacto (opcional)</label>
            <input id="contacto" value={form.contacto} onChange={handleChange('contacto')} />

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
