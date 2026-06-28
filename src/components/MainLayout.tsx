import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../hooks/useAuth"

const MainLayout = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <>
            {user && <Navbar user={user} onLogout={handleLogout} />}
            <Outlet />
        </>
    )
}

export default MainLayout