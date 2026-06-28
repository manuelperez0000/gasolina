
import { FaTrash } from 'react-icons/fa';
import { useDashboard } from '../hooks/useDashboard.ts'
import { HiPencilSquare } from "react-icons/hi2";

export default function Dashboard() {
  const {
    registros,
    loading,
    placa,
    setPlaca,
    handleSubmit,
    setEditingPlaca,
    editingId,
    editingPlaca,
    handleSaveEdit,
    handleCancelEdit,
    handleStartEdit,
    handleDelete,
  } = useDashboard()

  return (
    <div>
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="card shadow mb-4">
          <div className="card-body p-4">
            <h5 className="card-title">Registrar Surtido</h5>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-lg text-uppercase"
                  placeholder="Ingrese la placa"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  required
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="submit"
                  className="btn btn-success btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card shadow">
          <div className="card-body p-4">
            <h5 className="card-title">
              Registros de Hoy ({registros.length})
            </h5>
            {registros.length === 0 ? (
              <p className="text-muted mb-0">
                No hay registros por ahora.
              </p>
            ) : (
              <div className="list-group">
                {registros.map((r) => (
                  <div
                    key={r.id}
                    className="list-group-item d-flex justify-content-between align-items-center gap-3"
                  >
                    {editingId === r.id ? (
                      <div className="d-flex flex-grow-1 gap-2 align-items-center">
                        <input
                          type="text"
                          className="form-control form-control-sm text-uppercase"
                          value={editingPlaca}
                          onChange={(e) => setEditingPlaca(e.target.value.toUpperCase())}
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          onClick={() => handleSaveEdit(r.id!)}
                          disabled={loading}
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={handleCancelEdit}
                          disabled={loading}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="fw-bold text-uppercase d-block">{r.placa}</span>
                        </div>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleStartEdit(r)}
                            disabled={loading}
                          >
                            <HiPencilSquare />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(r.id)}
                            disabled={loading}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
