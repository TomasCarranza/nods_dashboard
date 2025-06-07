import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Login.css'

// Import the logo image
import NodsLogo from '/LogoNods.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      navigate('/')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 py-5">
      {/* Use the image for the logo */}
      <img src={NodsLogo} alt="NODS Logo" className="mb-4" style={{ width: '150px' }} /> {/* Adjust width as needed */}

      <div className="card custom-card-bg" style={{ maxWidth: '650px', width: '100%', backgroundColor: '#121212', border: 'none', boxShadow: 'none', borderRadius: '50px' }}>
        <div className="card-body custom-form-bg p-4" style={{ backgroundColor: '#121212', borderRadius: '30px' }}>
          <h2 className="card-title text-center text-white mb-4">Iniciar sesión en tu cuenta</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email-address" className="form-label visually-hidden">Correo electrónico</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-control custom-input-bg custom-text-color rounded-pill px-3 py-2"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label visually-hidden">Contraseña</label>
              <div className="input-group custom-input-group rounded-pill overflow-hidden">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="form-control custom-input-bg custom-text-color border-end-0 px-3 py-2"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-outline-secondary custom-input-bg border-start-0 text-white d-flex align-items-center px-3" type="button" onClick={togglePasswordVisibility} style={{ borderColor: '#444444'}}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash-fill text-white" viewBox="0 0 16 16">
                      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.936 6.588.8 8.305.8 10c0 2.022 3.245 4 8 4a8.18 8.18 0 0 0 2.06-.288zm4.95-4.95a3.5 3.5 0 0 1-4.474 4.474l-2.06 2.06c.936.936 2.653 1.068 4.474 1.068 4.755 0 8-1.978 8-4s-3.245-4-8-4zm-1.476-5.476a1.5 1.5 0 0 0-2.018 2.018l1.08 1.08a3.5 3.5 0 0 1 2.018-2.018z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill text-white" viewBox="0 0 16 16">
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label text-white" htmlFor="rememberMe">
                Recordarme
              </label>
            </div>

            {error && (
              <div className="text-danger text-center mt-2">{error}</div>
            )}

            <div className="d-grid gap-2 mx-auto" style={{ maxWidth: '200px'}}>
              <button
                type="submit"
                disabled={loading}
                className="btn custom-login-button mt-3 rounded-pill font-weight-medium"
              >
                {loading ? 'Cargando...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 