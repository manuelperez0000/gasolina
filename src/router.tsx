import { Navigate, Route, Routes } from "react-router-dom"
import MainLayout from "./components/MainLayout"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Cajero from "./pages/Cajero"
import UserAdmin from "./pages/UserAdmin"

const Router = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/cajero" element={<Cajero />} />
                <Route path="/usuarios" element={<UserAdmin />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}

export default Router