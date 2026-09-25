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

const emptyForm = {
  descripcion: '',
  precio: '',
  categoria: '',
}

function validate(form) {
  const errors = {}
  if (!form.descripcion.trim()) {
    errors.descripcion = 'Requerido'
  }
  const precio = Number(form.precio)
  if (!form.precio || Number.isNaN(precio) || precio <= 0) {
    errors.precio = 'Debe ser un número mayor a 0'
  }
  return errors
}

function formatPrecio(precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(precio)
}

async function crearServicio(payload) {
  const contadorRef = doc(db, 'contadores', 'servicios')
  const servicioRef = doc(collection(db, 'servicios'))

  await runTransaction(db, async (transaction) => {
    const contadorSnap = await transaction.get(contadorRef)
    const ultimoNumero = contadorSnap.exists() ? contadorSnap.data().ultimoNumero : 0
    const siguienteNumero = ultimoNumero + 1
    const codigo = `S-${String(siguienteNumero).padStart(3, '0')}`

    transaction.set(contadorRef, { ultimoNumero: siguienteNumero }, { merge: true })
    transaction.set(servicioRef, { ...payload, codigo })
  })
}

export default function Servicios() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const serviciosQuery = query(collection(db, 'servicios'), orderBy('codigo'))
    const unsubscribe = onSnapshot(serviciosQuery, (snapshot) => {
      setServicios(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const filteredServicios = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return servicios
    return servicios.filter(
      (servicio) =>
        servicio.descripcion.toLowerCase().includes(term) ||
        (servicio.categoria ?? '').toLowerCase().includes(term),
    )
  }, [servicios, search])

  const openCreateModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (servicio) => {
    setEditingId(servicio.id)
    setForm({
      descripcion: servicio.descripcion,
      precio: String(servicio.precio),
      categoria: servicio.categoria ?? '',
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

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
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        categoria: form.categoria.trim(),
      }
      if (editingId) {
        await updateDoc(doc(db, 'servicios', editingId), payload)
      } else {
        await crearServicio(payload)
      }
      setIsModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (servicio) => {
    const confirmed = window.confirm(`¿Eliminar el servicio "${servicio.descripcion}"?`)
    if (!confirmed) return
    await deleteDoc(doc(db, 'servicios', servicio.id))
  }

  return (
    <div className="view view--servicios">
      <div className="view__header">
        <h1>Servicios</h1>
        <button type="button" className="btn btn--primary" onClick={openCreateModal}>
          Nuevo servicio
        </button>
      </div>

      <input
        type="search"
        className="search-input"
        placeholder="Buscar por descripción o categoría..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loading ? (
        <p>Cargando servicios...</p>
      ) : filteredServicios.length === 0 ? (
        <p>No hay servicios cargados.</p>
      ) : (
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredServicios.map((servicio) => (
                <tr key={servicio.id}>
                  <td>{servicio.codigo}</td>
                  <td>{servicio.descripcion}</td>
                  <td>{servicio.categoria || '—'}</td>
                  <td>{formatPrecio(servicio.precio)}</td>
                  <td className="table__actions">
                    <button type="button" className="btn btn--ghost" onClick={() => openEditModal(servicio)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--danger"
                      onClick={() => handleDelete(servicio)}
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
        <Modal title={editingId ? 'Editar servicio' : 'Nuevo servicio'} onClose={closeModal}>
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="descripcion">Descripción</label>
            <input id="descripcion" value={form.descripcion} onChange={handleChange('descripcion')} />
            {errors.descripcion && <p className="error">{errors.descripcion}</p>}

            <label htmlFor="precio">Precio</label>
            <input
              id="precio"
              type="number"
              min="0"
              step="0.01"
              value={form.precio}
              onChange={handleChange('precio')}
            />
            {errors.precio && <p className="error">{errors.precio}</p>}

            <label htmlFor="categoria">Categoría (opcional)</label>
            <input id="categoria" value={form.categoria} onChange={handleChange('categoria')} />

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
