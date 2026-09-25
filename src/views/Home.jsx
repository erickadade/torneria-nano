import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase.js'

const ACCESOS_PRINCIPALES = [
  {
    to: '/presupuestos',
    label: 'Presupuestos',
    descripcion: 'Armar un presupuesto nuevo',
  },
  {
    to: '/stock',
    label: 'Stock',
    descripcion: 'Consultar o cargar productos',
  },
  {
    to: '/facturas',
    label: 'Facturas',
    descripcion: 'Registrar una factura o marcar un cobro',
  },
]

const ACCESOS_SECUNDARIOS = [
  { to: '/clientes', label: 'Clientes' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/proveedores', label: 'Proveedores' },
]

export default function Home() {
  const [productos, setProductos] = useState([])
  const [presupuestos, setPresupuestos] = useState([])
  const [facturas, setFacturas] = useState([])

  useEffect(() => {
    return onSnapshot(collection(db, 'productos'), (snapshot) => {
      setProductos(snapshot.docs.map((docSnap) => docSnap.data()))
    })
  }, [])

  useEffect(() => {
    return onSnapshot(collection(db, 'presupuestos'), (snapshot) => {
      setPresupuestos(snapshot.docs.map((docSnap) => docSnap.data()))
    })
  }, [])

  useEffect(() => {
    return onSnapshot(collection(db, 'facturas'), (snapshot) => {
      setFacturas(snapshot.docs.map((docSnap) => docSnap.data()))
    })
  }, [])

  const stockBajoCount = productos.filter((p) => p.stockActual <= p.stockMinimo).length
  const borradorCount = presupuestos.filter((p) => p.estado === 'borrador').length
  const pendienteCobroCount = facturas.filter((f) => f.estadoPago === 'pendiente').length

  const metricaPorAcceso = {
    '/stock': stockBajoCount > 0 ? `${stockBajoCount} con stock bajo` : 'Stock al día',
    '/presupuestos': borradorCount > 0 ? `${borradorCount} en borrador` : 'Sin borradores',
    '/facturas': pendienteCobroCount > 0 ? `${pendienteCobroCount} pendientes de cobro` : 'Todo cobrado',
  }

  return (
    <div className="view view--home">
      <h1>Inicio</h1>

      <div className="home-grid">
        {ACCESOS_PRINCIPALES.map((acceso) => (
          <Link key={acceso.to} to={acceso.to} className="home-card">
            <span className="home-card__label">{acceso.label}</span>
            <span className="home-card__descripcion">{acceso.descripcion}</span>
            <span className="home-card__metrica">{metricaPorAcceso[acceso.to]}</span>
          </Link>
        ))}
      </div>

      <h2>Otras secciones</h2>
      <div className="home-secundarios">
        {ACCESOS_SECUNDARIOS.map((acceso) => (
          <Link key={acceso.to} to={acceso.to} className="home-secundario">
            {acceso.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
