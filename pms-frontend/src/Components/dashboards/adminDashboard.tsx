// import Navbar from "../Navbar/navbar"

import { Outlet, ScrollRestoration } from "react-router-dom"
import AdminNavbar from "../../features/Admin/AdminNavbar"




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