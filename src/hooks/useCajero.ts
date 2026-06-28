import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from '../db/firebase'
import type { RegistroGasolina } from '../types'

const REGISTROS_COLLECTION = 'registros_gasolina'

function getTodayRange(): { start: Date; end: Date } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const end = new Date(start.getTime() + 86400000)
  return { start, end }
}

interface UseCajeroReturn {
  registros: RegistroGasolina[]
  loading: boolean
  selectedRegistro: RegistroGasolina | null
  modalOpen: boolean
  modalLitros: number
  setModalLitros: React.Dispatch<React.SetStateAction<number>>
  openModal: (registro: RegistroGasolina) => void
  closeModal: () => void
  handleSaveLitros: (e: FormEvent<HTMLFormElement>) => Promise<void>
}

export function useCajero(): UseCajeroReturn {
  const [registros, setRegistros] = useState<RegistroGasolina[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRegistro, setSelectedRegistro] = useState<RegistroGasolina | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalLitros, setModalLitros] = useState(0)

  const fetchRegistros = useCallback(() => {
    const { start, end } = getTodayRange()
    const q = query(
      collection(db, REGISTROS_COLLECTION),
      where('fecha', '>=', start),
      where('fecha', '<', end),
      orderBy('fecha', 'asc'),
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as RegistroGasolina)
        setRegistros(docs)
        setLoading(false)
      },
      (error) => {
        console.error('Error en la suscripción de registros de cajero:', error)
        setRegistros([])
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const openModal = useCallback((registro: RegistroGasolina) => {
    setSelectedRegistro(registro)
    const defaultLitros = registro.litros != null && registro.litros > 0
      ? registro.litros
      : registro.tipoVehiculo === 'moto'
      ? 10
      : registro.tipoVehiculo === 'carro'
      ? 25
      : 0
    setModalLitros(defaultLitros)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setSelectedRegistro(null)
  }, [])

  const handleSaveLitros = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!selectedRegistro?.id) return

      setLoading(true)
      try {
        await updateDoc(doc(db, REGISTROS_COLLECTION, selectedRegistro.id), {
          litros: Number(modalLitros) || 0,
        })
        closeModal()
      } catch (error) {
        console.error('Error al actualizar litros:', error)
      } finally {
        setLoading(false)
      }
    },
    [closeModal, modalLitros, selectedRegistro],
  )

  useEffect(() => {
    const unsubscribe = fetchRegistros()
    return () => unsubscribe()
  }, [fetchRegistros])

  return {
    registros,
    loading,
    selectedRegistro,
    modalOpen,
    modalLitros,
    setModalLitros,
    openModal,
    closeModal,
    handleSaveLitros,
  }
}
