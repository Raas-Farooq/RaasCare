// import Navbar from "../Navbar/navbar"

import { Outlet } from "react-router-dom"
import AdminNavbar from "../../features/Admin/components/AdminNavbar"





function AdminDashboard() {

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminDashboard