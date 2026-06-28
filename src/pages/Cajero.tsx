import CajeroModal from '../components/CajeroModal'
import { useCajero } from '../hooks/useCajero'

const Cajero = () => {
  const {
    registros,
    loading,
    selectedRegistro,
    modalOpen,
    modalLitros,
    setModalLitros,
    openModal,
    closeModal,
    handleSaveLitros,
  } = useCajero()

  return (
    <div>
      <div className="container" style={{ maxWidth: 700 }}>
        <div className="card shadow mb-4">
          <div className="card-body p-4">
            <h3 className="card-title">Cajero</h3>
            <p className="text-muted">Haz clic en una placa para actualizar la cantidad de litros.</p>
          </div>
        </div>

        <div className="card shadow">
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="card-title mb-0">Placas registradas ({registros.length})</h5>
            </div>

            {registros.length === 0 ? (
              <p className="text-muted mb-0">No hay registros por ahora.</p>
            ) : (
              <div className="list-group">
                {registros.map((registro) => {
                  const litrosValue = registro.litros ?? 0
                  const rowClass = litrosValue > 0 ? 'bg-success text-white' : 'bg-danger text-white'

                  return (
                    <button
                      key={registro.id}
                      type="button"
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${rowClass}`}
                      onClick={() => openModal(registro)}
                    >
                      <div>
                        <div className="fw-bold text-uppercase">{registro.placa}</div>
                        <small>{registro.tipoVehiculo ?? 'Tipo desconocido'}</small>
                      </div>
                      <div className="text-end">
                        <span style={{ fontWeight: 600 }}>
                          {litrosValue} L
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <CajeroModal
        registro={selectedRegistro}
        litros={modalLitros}
        open={modalOpen}
        loading={loading}
        onChangeLitros={setModalLitros}
        onClose={closeModal}
        onSave={handleSaveLitros}
      />
    </div>
  )
}

export default Cajero