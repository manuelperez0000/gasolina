export interface Usuario {
  id?: string
  email: string
  username: string
  rol: 'admin' | 'cajero'
}

export interface RegistroGasolina {
  id?: string
  placa: string
  fecha: Date
  registradoPor: string
  litros?: number
  comunidad?: string
  apoyo?: string
  tipoVehiculo?: 'moto' | 'carro' | 'lancha'
}

import type { Dispatch, SetStateAction, FormEvent } from 'react'

export interface AuthState {
  user: Usuario | null
  loading: boolean
  error: string | null
}

export interface LoginProps {
  auth: AuthState & {
    email: string
    password: string
    setEmail: Dispatch<SetStateAction<string>>
    setPassword: Dispatch<SetStateAction<string>>
    handleSubmit: (e: FormEvent) => Promise<void>
    login: (email: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
  }
}

export interface DashboardProps {
  user: Usuario
  onLogout: () => void
}

export interface SubmitResult {
  success: boolean
  message: string
}

export interface UseDashboardReturn {
  registros: RegistroGasolina[]
  loading: boolean
  placa: string
  setPlaca: React.Dispatch<React.SetStateAction<string>>
  handleSubmit: (e: FormEvent) => Promise<SubmitResult>
  buscarRegistrosHoy: () => Promise<void>
  submitResult: SubmitResult | null
  editarPlaca: (id: string, nuevaPlaca: string) => Promise<SubmitResult>
  eliminarPlaca: (id: string) => Promise<SubmitResult>
  editingId: string | null
  editingPlaca: string
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>
  setEditingPlaca: React.Dispatch<React.SetStateAction<string>>,
  handleSaveEdit: (id: string) => Promise<void>,
  handleCancelEdit: () => void,
  handleStartEdit: (registro: { id?: string; placa: string }) => void,
  handleDelete: (id?: string) => Promise<void>
  tipoVehiculo: 'moto' | 'carro' | 'lancha'
  setTipoVehiculo: React.Dispatch<React.SetStateAction<'moto' | 'carro' | 'lancha'>>
  litros: number
  setLitros: React.Dispatch<React.SetStateAction<number>>
  fecha: string
  setFecha: React.Dispatch<React.SetStateAction<string>>
  comunidad: string
  setComunidad: React.Dispatch<React.SetStateAction<string>>
  apoyo: string
  setApoyo: React.Dispatch<React.SetStateAction<string>>
} 