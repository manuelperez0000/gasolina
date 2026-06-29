
import { FaTrash, FaMotorcycle, FaCar, FaShip } from 'react-icons/fa'
import { useDashboard } from '../hooks/useDashboard.ts'
import { HiPencilSquare } from 'react-icons/hi2'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { RiFileExcel2Fill } from "react-icons/ri";
import { useMemo, useState } from 'react'


function parseFecha(value: unknown): Date | null {
  if (value instanceof Date) return value
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: unknown }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate()
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

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
    tipoVehiculo,
    setTipoVehiculo,
    litros,
    setLitros,
    fecha,
    setFecha,
    comunidad,
    setComunidad,
    apoyo,
    setApoyo,
  } = useDashboard()

  const [filtroPlaca, setFiltroPlaca] = useState('')

  const registrosFiltrados = useMemo(() => {
    const filtro = filtroPlaca.trim().toUpperCase()

    if (!filtro) return registros

    return registros.filter((registro) => registro.placa.toUpperCase().includes(filtro))
  }, [registros, filtroPlaca])

  return (
    <div>
      <div className="container p-1" style={{ maxWidth: 600, width: '100%' }}>
        <div className="card shadow mb-1">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3 d-flex flex-column flex-sm-row gap-2 align-items-start align-items-sm-center">
                <div className="d-flex align-items-center justify-content-between mb-1 w-100">

                  <h5 className="card-title">Registrar Surtido</h5>
                  <div className="btn-group" role="group" aria-label="Tipo de vehiculo">
                    <button
                      type="button"
                      className={`btn ${tipoVehiculo === 'moto' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setTipoVehiculo('moto')}
                    >
                      <FaMotorcycle />
                    </button>
                    <button
                      type="button"
                      className={`btn ${tipoVehiculo === 'carro' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setTipoVehiculo('carro')}
                    >
                      <FaCar />
                    </button>
                    <button
                      type="button"
                      className={`btn ${tipoVehiculo === 'lancha' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setTipoVehiculo('lancha')}
                    >
                      <FaShip />
                    </button>
                  </div>
                </div>

                <div className="flex-fill d-flex flex-column gap-2 w-100">
                  <div className="w-100 gap-2 d-flex justify-content-between align-items-center">
                    <div className="input-group w-100">
                      <span className="input-group-text">Litros</span>
                      <input type="number" className="form-control" value={litros} onChange={(e) => setLitros(Number(e.target.value))} min={0} />
                    </div>

                    <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="mb-3 d-flex flex-column flex-md-row gap-2">
                <div className="flex-fill">
                  <label className="form-label small text-muted mb-1">Comunidad</label>
                  <input className="form-control" value={comunidad} onChange={(e) => setComunidad(e.target.value)} />
                </div>
                <div className="flex-fill">
                  <label className="form-label small text-muted mb-1">Apoyo</label>
                  <input className="form-control" value={apoyo} onChange={(e) => setApoyo(e.target.value)} />
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2">
                <input
                  type="text"
                  className="form-control form-control-lg text-uppercase flex-fill"
                  placeholder="Ingrese la placa"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  required
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100 w-sm-auto"
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
            <div className="d-flex flex-row flex-wrap gap-2 align-items-center justify-content-between mb-3">
              <div className="d-flex flex-row align-items-center gap-2 flex-wrap flex-grow-1">
                <h5 className="card-title mb-0">{registrosFiltrados.length} registros</h5>
                <div className="input-group input-group-sm" style={{ minWidth: 220, flex: '1 1 220px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar"
                    value={filtroPlaca}
                    onChange={(e) => setFiltroPlaca(e.target.value.toUpperCase())}
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn btn-success btn-sm d-flex align-items-center justify-content-center"
                style={{ width: 38, height: 38, padding: 0 }}
                onClick={async () => {
                  const workbook = new ExcelJS.Workbook()
                  const sheet = workbook.addWorksheet('Registros de Hoy')

                  sheet.columns = [
                    { header: 'Placa', key: 'placa', width: 15 },
                    { header: 'Tipo', key: 'tipo', width: 12 },
                    { header: 'Litros', key: 'litros', width: 10 },
                    { header: 'Comunidad', key: 'comunidad', width: 20 },
                    { header: 'Apoyo', key: 'apoyo', width: 18 },
                    { header: 'Fecha', key: 'fecha', width: 16 },
                    { header: 'Registrado Por', key: 'registradoPor', width: 20 },
                  ]

                  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
                  sheet.getRow(1).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF0D6EFD' },
                  }

                  registrosFiltrados.forEach((registro) => {
                    const fechaObj = parseFecha(registro.fecha)
                    const fechaStr = fechaObj ? fechaObj.toLocaleDateString() : ''
                    const tipo = registro.tipoVehiculo === 'carro' ? 'Carro' : registro.tipoVehiculo === 'lancha' ? 'Lancha' : 'Moto'

                    sheet.addRow({
                      placa: registro.placa,
                      tipo,
                      litros: registro.litros ?? 0,
                      comunidad: registro.comunidad ?? 'La Horqueta',
                      apoyo: registro.apoyo ?? 'general',
                      fecha: fechaStr,
                      registradoPor: registro.registradoPor,
                    })
                  })

                  sheet.columns.forEach((column) => {
                    column.alignment = { vertical: 'middle', horizontal: 'left' }
                  })

                  const buffer = await workbook.xlsx.writeBuffer()
                  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                  saveAs(blob, `surtidos-${tipoVehiculo}-${new Date().toISOString().slice(0, 10)}.xlsx`)
                }}
              >
                <RiFileExcel2Fill />
              </button>
            </div>
            {registrosFiltrados.length === 0 ? (
              <p className="text-muted mb-0">
                No hay registros por ahora.
              </p>
            ) : (
              <div className="list-group">
                {registrosFiltrados.map((r) => {
                  const fechaObj = parseFecha(r.fecha)
                  const fechaStr = fechaObj ? fechaObj.toLocaleDateString() : ''

                  const TipoIcon = r.tipoVehiculo === 'carro' ? FaCar : r.tipoVehiculo === 'lancha' ? FaShip : FaMotorcycle

                  return (
                    <div
                      key={r.id}
                      className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3"
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
                            <small className="text-muted d-flex flex-wrap gap-2 align-items-center">
                              <TipoIcon />
                              <span>{r.litros ?? 0} L</span>
                              <span>• {r.apoyo ?? 'general'}</span>
                              <span>• {r.comunidad ?? 'La Horqueta'}</span>
                              <span className="ms-2">{fechaStr}</span>
                            </small>
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
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
