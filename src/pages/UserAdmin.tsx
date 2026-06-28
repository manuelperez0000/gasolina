import { useUserAdmin } from '../hooks/useUserAdmin'

export default function UserAdmin() {
  const {
    nombre,
    correo,
    tipo,
    password,
    loading,
    successMessage,
    setNombre,
    setCorreo,
    setTipo,
    setPassword,
    crearUsuario,
  } = useUserAdmin()

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <div className="card shadow mb-4">
        <div className="card-body p-4">
          <h4 className="card-title mb-3">Administración de usuarios</h4>

          {successMessage ? (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          ) : null}

          <form onSubmit={crearUsuario}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="correo" className="form-label">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tipo" className="form-label">
                Tipo de usuario
              </label>
              <select
                id="tipo"
                className="form-select"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as 'admin' | 'cajero')}
              >
                <option value="cajero">Cajero</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Creando usuario...' : 'Crear usuario'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
