import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from 'react'
import Navbar from "../components/Navbar"
import { useAuth } from "../hooks/useAuth"

const MainLayout = () => {
    const navigate = useNavigate()
    const { user, logout, loading } = useAuth()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login')
        }
    }, [loading, user, navigate])

    if (loading) return null
    if (!user) return null

    return (
        <>
            <Navbar user={user} onLogout={handleLogout} />
            <Outlet />
        </>
    )
}

export default MainLayout
