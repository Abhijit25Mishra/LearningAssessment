import { useState, type FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { setToken, getToken } from '../../utils/token'
import { login } from '../../services/authService'
import './index.css'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    if (getToken()) {
        return <Navigate to="/" />
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        try {
            const data = await login(username, password)
            if (data.validuser) {
                setToken(data.token)
                navigate('/')
            } else {
                setError('Invalid username or password')
            }
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">
                    {/* Placeholder for logo */}
                    <img src="https://assets.ccbp.in/frontend/react-js/logo-img.png" alt="website logo" />
                </div>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div className="input-container">
                        <label className="input-label" htmlFor="username">
                            USERNAME
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="input-field"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label className="input-label" htmlFor="password">
                            PASSWORD
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="input-field"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    )
}

export default Login
