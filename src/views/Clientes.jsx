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

const CONDICIONES_IVA = [
  'Responsable Inscripto',
  'Monotributista',
  'Exento',
  'Consumidor Final',
]

const emptyForm = {
  nombreRazonSocial: '',
  cuitODni: '',
  condicionIva: CONDICIONES_IVA[0],
  email: '',
  telefono: '',
}

function validate(form) {
  const errors = {}
  if (!form.nombreRazonSocial.trim()) {
    errors.nombreRazonSocial = 'Requerido'
  }
  if (!/^\d[\d-]*\d$/.test(form.cuitODni.trim())) {
    errors.cuitODni = 'Solo números (guiones opcionales)'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Email inválido'
  }
  return errors
}

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const clientesQuery = query(collection(db, 'clientes'), orderBy('nombreRazonSocial'))
    const unsubscribe = onSnapshot(clientesQuery, (snapshot) => {
      setClientes(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const filteredClientes = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return clientes
    return clientes.filter(
      (cliente) =>
        cliente.nombreRazonSocial.toLowerCase().includes(term) ||
        cliente.cuitODni.toLowerCase().includes(term),
    )
  }, [clientes, search])

  const openCreateModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (cliente) => {
    setEditingId(cliente.id)
    setForm({
      nombreRazonSocial: cliente.nombreRazonSocial,
      cuitODni: cliente.cuitODni,
      condicionIva: cliente.condicionIva,
      email: cliente.email,
      telefono: cliente.telefono ?? '',
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
        nombreRazonSocial: form.nombreRazonSocial.trim(),
        cuitODni: form.cuitODni.trim(),
        condicionIva: form.condicionIva,
        email: form.email.trim(),
        telefono: form.telefono.trim(),
      }
      if (editingId) {
        await updateDoc(doc(db, 'clientes', editingId), payload)
      } else {
        await addDoc(collection(db, 'clientes'), payload)
      }
      setIsModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (cliente) => {
    const confirmed = window.confirm(`¿Eliminar a ${cliente.nombreRazonSocial}?`)
    if (!confirmed) return
    await deleteDoc(doc(db, 'clientes', cliente.id))
  }

  return (
    <div className="view view--clientes">
      <div className="view__header">
        <h1>Clientes</h1>
        <button type="button" className="btn btn--primary" onClick={openCreateModal}>
          Nuevo cliente
        </button>
      </div>

      <input
        type="search"
        className="search-input"
        placeholder="Buscar por nombre o CUIT/DNI..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loading ? (
        <p>Cargando clientes...</p>
      ) : filteredClientes.length === 0 ? (
        <p>No hay clientes cargados.</p>
      ) : (
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre / Razón social</th>
                <th>CUIT / DNI</th>
                <th>Condición IVA</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nombreRazonSocial}</td>
                  <td>{cliente.cuitODni}</td>
                  <td>{cliente.condicionIva}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono || '—'}</td>
                  <td className="table__actions">
                    <button type="button" className="btn btn--ghost" onClick={() => openEditModal(cliente)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--danger"
                      onClick={() => handleDelete(cliente)}
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
        <Modal title={editingId ? 'Editar cliente' : 'Nuevo cliente'} onClose={closeModal}>
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="nombreRazonSocial">Nombre / Razón social</label>
            <input
              id="nombreRazonSocial"
              value={form.nombreRazonSocial}
              onChange={handleChange('nombreRazonSocial')}
            />
            {errors.nombreRazonSocial && <p className="error">{errors.nombreRazonSocial}</p>}

            <label htmlFor="cuitODni">CUIT / DNI</label>
            <input id="cuitODni" value={form.cuitODni} onChange={handleChange('cuitODni')} />
            {errors.cuitODni && <p className="error">{errors.cuitODni}</p>}

            <label htmlFor="condicionIva">Condición frente al IVA</label>
            <select id="condicionIva" value={form.condicionIva} onChange={handleChange('condicionIva')}>
              {CONDICIONES_IVA.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>

            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={handleChange('email')} />
            {errors.email && <p className="error">{errors.email}</p>}

            <label htmlFor="telefono">Teléfono</label>
            <input id="telefono" value={form.telefono} onChange={handleChange('telefono')} />

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
