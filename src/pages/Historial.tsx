import { useState } from 'react'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '../db/firebase'
import type { RegistroGasolina } from '../types'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { RiFileExcel2Fill } from 'react-icons/ri'

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

export default function Historial() {
    const [fechaBusqueda, setFechaBusqueda] = useState('')
    const [registros, setRegistros] = useState<RegistroGasolina[]>([])
    const [loading, setLoading] = useState(false)
    const [busquedaRealizada, setBusquedaRealizada] = useState(false)

    const buscarRegistros = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!fechaBusqueda) return

        setLoading(true)
        setBusquedaRealizada(true)

        try {
            const [year, month, day] = fechaBusqueda.split('-').map(Number)
            const start = new Date(year, month - 1, day, 0, 0, 0, 0)
            const end = new Date(year, month - 1, day + 1, 0, 0, 0, 0)

            const q = query(
                collection(db, 'registros_gasolina'),
                where('fecha', '>=', start),
                where('fecha', '<', end),
                orderBy('fecha', 'desc'),
            )

            const snapshot = await getDocs(q)
            const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as RegistroGasolina)

            docs.sort((a, b) => {
                const aTime = a.fecha instanceof Date ? a.fecha.getTime() : 0
                const bTime = b.fecha instanceof Date ? b.fecha.getTime() : 0
                return bTime - aTime
            })

            setRegistros(docs)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container p-1" style={{ maxWidth: 700 }}>
            <div className="card shadow">
                <div className="card-body p-4">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-1">
                        <div className="d-flex align-items-center justify-content-between">
                            <h4 className="mb-0">Historial</h4>
                            <button
                                type="button"
                                className="btn btn-success btn-sm d-flex align-items-center justify-content-center"
                                style={{ width: 38, height: 38, padding: 0 }}
                                onClick={async () => {
                                    if (registros.length === 0) return

                                    const workbook = new ExcelJS.Workbook()
                                    const sheet = workbook.addWorksheet('Historial')

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

                                    registros.forEach((registro) => {
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
                                    saveAs(blob, `historial-${fechaBusqueda || 'sin-fecha'}.xlsx`)
                                }}
                            >
                                <RiFileExcel2Fill />
                            </button>
                        </div>
                        <p className="text-muted mb-0">Consulta los registros por fecha.</p>
                    </div>

                    <form onSubmit={buscarRegistros} className="d-flex justify-content-between gap-2 mb-1">
                        <input
                            type="date"
                            className="form-control"
                            value={fechaBusqueda}
                            onChange={(e) => setFechaBusqueda(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary" disabled={loading || !fechaBusqueda}>
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>

                    {!busquedaRealizada ? (
                        <div className="text-muted">Seleccione una fecha y presione buscar para ver los registros.</div>
                    ) : loading ? null : registros.length === 0 ? (
                        <div className="text-muted">No hay registros para la fecha seleccionada.</div>
                    ) : (
                        <div className="list-group">
                            {registros.map((registro) => {
                                const fechaObj = parseFecha(registro.fecha)
                                const fechaStr = fechaObj ? fechaObj.toLocaleString() : ''

                                return (
                                    <div key={registro.id} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-start gap-3">
                                            <div>
                                                <div className="fw-bold text-uppercase">{registro.placa}</div>
                                                <small className="text-muted d-block">
                                                    {registro.litros ?? 0} L • {registro.apoyo ?? 'general'} • {registro.comunidad ?? 'La Horqueta'}
                                                </small>
                                                <small className="text-muted d-block">{fechaStr}</small>
                                            </div>
                                            <div className="text-end">
                                                <span className="badge bg-primary">{registro.tipoVehiculo === 'carro' ? 'Carro' : registro.tipoVehiculo === 'lancha' ? 'Lancha' : 'Moto'}</span>
                                                <div className="small text-muted mt-1">{registro.registradoPor}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
