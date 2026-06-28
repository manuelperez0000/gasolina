import { FiEye, FiEyeOff } from 'react-icons/fi'
import logo from '../assets/logo.png'
import useLogin from '../hooks/useLogin'
export default function Login() {

  const {
    email,
    password,
    setEmail,
    setPassword,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    login,
    loading,
  } = useLogin()

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow pt-3" style={{ maxWidth: 400, width: '100%' }}>
        <div className="text-center">
          <img src={logo} alt="Logo" style={{ maxWidth: 100, height: 'auto' }} className="img-fluid" />
        </div>
        <div className="card-body p-3">
          <h3 className="text-center mb-3">Iniciar Sesión</h3>
          <form onSubmit={login}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="position-relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control pe-5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  style={{ lineHeight: 1, color: '#6c757d' }}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Recordar credenciales
              </label>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <i className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i> : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
