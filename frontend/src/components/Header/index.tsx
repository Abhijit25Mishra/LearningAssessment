import { Link, useNavigate } from 'react-router-dom'
import { removeToken } from '../../utils/token'
import './index.css'

const Header = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        removeToken()
        navigate('/login')
    }

    return (
        <nav className="header-container">
            <div className="header-logo">
                <Link to="/">
                    <img src="https://assets.ccbp.in/frontend/react-js/logo-img.png" alt="website logo" />
                </Link>
            </div>
            <ul className="nav-menu">
                <li>
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/jobs" className="nav-link">
                        Jobs
                    </Link>
                </li>
            </ul>
            <button type="button" className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </nav>
    )
}

export default Header
