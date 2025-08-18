
import { BookAIcon, DollarSignIcon, LayoutDashboardIcon, User, Users } from "lucide-react";
import { useState } from "react";
import DashboardCharts from "./charts/dashboardCharts";
import AddNewDoctor from "./addNewDoctor";


const AdminHome = () => {



    const [activeTab, setActiveTab] = useState<'Dashboard' | 'Appointments' | 'Profile'>('Dashboard');

    const [bookingDetails, setBookingDetails] = useState([{
        patientName: 'Ali',
        paymentMethod: 'cash',
        date: '8 July 09-10 AM',
        age: '29',
        fee: '$30',
        status: 'Completed',
        action: 'Done'
    },
    {
        patientName: 'Hamza',
        paymentMethod: 'online',
        date: '18 July 09-10 AM',
        age: '33',
        fee: '$40',
        status: 'Completed',
        action: 'Done'
    },
    {
        patientName: 'Shayan',
        paymentMethod: 'cash',
        date: '28 July 11-12 AM',
        age: '39',
        fee: '$50',
        status: 'Completed',
        action: 'Done'
    },
    {
        patientName: 'Faiz',
        paymentMethod: 'cash',
        date: '15 Aug 09-10 AM',
        age: '27',
        fee: '$30',
        status: 'Pending',
        action: 'cancel'
    }]);

    const stylingOfMain = `w-full max-w-5xl bg-white rounded-xl shadow-sm border border-gray-200 p-6 my-4 mx-auto transition-opacity duration-300`
    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                <nav className="w-full max-w-5xl mx-auto py-4 px-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button
                            aria-selected={activeTab === 'Dashboard'}
                            onClick={() => setActiveTab('Dashboard')}
                            className={`flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none ${activeTab === 'Dashboard' && 'bg-blue-50 border-blue-500 shadow-md scale-[1.02]'}`}
                        >
                            <LayoutDashboardIcon className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-700">Dashboard</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('Appointments')}
                            aria-selected={activeTab === 'Appointments'}
                            className={`flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none ${activeTab === 'Appointments' && 'bg-blue-50 border-blue-500 shadow-md scale-[1.02]'}`}
                        >
                            <BookAIcon className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-700">Appointments</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('Profile')}
                            aria-selected={activeTab === 'Profile'}
                            className={`flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none ${activeTab === 'Profile' && 'bg-blue-50 border-blue-500 shadow-md scale-[1.02]'}`}>
                            <User className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-700">
                                Add New Doctor
                            </span>
                        </button>
                    </div>
                </nav>
                <div className="w-full flex justify-center">
                    {/* Main Dashboard */}
                    <main className={` ${stylingOfMain} ${activeTab === 'Dashboard' ? 'opacity-100 relative' : 'opacity-0 absolute pointer-events-none'}`}>
                        <section className="px-6 pb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {/* Earnings Card */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 rounded-lg bg-blue text-blue-600">
                                            <DollarSignIcon className="w-6 h-6" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Revenue Monthly</p>
                                            <p className="text-2xl font-semibold text-gray-800">$12,345</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointments Card */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 rounded-lg bg-green-50 text-green-600">
                                            <BookAIcon className="w-6 h-6" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Monthly Appointments</p>
                                            <p className="text-2xl font-semibold text-gray-800">220</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Patients Card */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Reports</p>
                                            <p className="text-2xl font-semibold text-gray-800">8</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="px-6 pb-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Appointments And Revenue</h2>
                                </div>
                                <DashboardCharts />
                            </div>
                        </section>
                    </main>
                    {/* Bookings */}
                    <main className={`${stylingOfMain} ${activeTab === 'Appointments' ? 'opacity-100 relative' : 'opacity-0 absolute pointer-events-none'}`}>
                        <section className="px-6 pb-6">
                            <header>
                                <h1 className="border-b border-gray-200 px-2 py-5 text-blue-600 shadow-md text-xl hover:border-gray-300 hover:shadow-lg transition-all duration-200"> Recent Appointments</h1>
                            </header>
                            <div className="booking-item overflow-x-auto">
                                <table className="min-w-max w-full border border-gray-200 rounded-lg overflow-hidden" cellPadding="10" cellSpacing="0" >
                                    <thead className="border border-gray-100 text-sm md:text-base">
                                        <tr>
                                            <th className="text-left px-3 py-2 md:px-6 md:py-3 text-gray-600 font-medium border-b">Name</th>
                                            <th className="text-left px-3 py-2 md:px-6 md:py-3 text-gray-600 font-medium border-b">Date</th>
                                            <th className="text-left px-3 py-2 md:px-6 md:py-3 text-gray-600 font-medium border-b">Age</th>
                                            <th className="text-left px-3 py-2 md:px-6 md:py-3 text-gray-600 font-medium border-b">Fee</th>
                                            <th className="text-left px-3 py-2 md:px-6 md:py-3 text-gray-600 font-medium border-b">Status</th>
                                            <th className="text-left px-3 py-2 md:px-6 md:py-3 text-gray-600 font-medium border-b">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookingDetails.map((booking, index) => (
                                            <tr key={index}>
                                                <td className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700">{booking.patientName}</td>
                                                <td className="px-3 py-2 md:px-6 md:py-4border-b text-gray-700">{booking.age}</td>
                                                <td className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700 whitespace-nowrap">{booking.date}</td>
                                                <td className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700">{booking.fee}</td>
                                                <td
                                                    className={`px-6 py-4 border-b font-medium ${booking.status === "Completed"
                                                        ? "text-green-600"
                                                        : "text-yellow-600"
                                                        }`}
                                                >{booking.status}</td>
                                                <td className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700">{booking.action}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </main>
                    {/* Profile */}
                    <main className={`h-fit ${stylingOfMain} ${activeTab === 'Profile' ? 'opacity-100 relative' : 'opacity-0 absolute pointer-events-none'}`}>
                        <AddNewDoctor />
                    </main>
                </div>
            </div>
        </>
    )
}

export default AdminHome