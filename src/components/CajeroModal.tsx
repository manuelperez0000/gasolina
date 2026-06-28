import type { FormEvent } from 'react'
import type { RegistroGasolina } from '../types'

interface CajeroModalProps {
  registro: RegistroGasolina | null
  litros: number
  open: boolean
  loading: boolean
  onChangeLitros: (value: number) => void
  onClose: () => void
  onSave: (e: FormEvent<HTMLFormElement>) => Promise<void>
}

export default function CajeroModal({
  registro,
  litros,
  open,
  loading,
  onChangeLitros,
  onClose,
  onSave,
}: CajeroModalProps) {
  if (!open || !registro) return null

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      role="dialog"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        overflowY: 'auto',
        backgroundColor: 'transparent',
      }}
    >
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 2000 }}
      ></div>
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        style={{ zIndex: 2005 }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Actualizar litros - {registro.placa}</h5>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
          </div>
          <form onSubmit={onSave}>
            <div className="modal-body">
              <label className="form-label">Cantidad de litros</label>
              <input
                type="number"
                className="form-control"
                value={litros}
                onChange={(e) => onChangeLitros(Number(e.target.value))}
                min={0}
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cerrar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
