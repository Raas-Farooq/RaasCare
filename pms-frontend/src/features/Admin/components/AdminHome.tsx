
import { BookAIcon, Check, Delete, LayoutDashboardIcon, Trash, User, Users } from "lucide-react";
import { useState } from "react";
// import DashboardCharts from "./charts/dashboardCharts";
// import AddNewDoctor from "./components/addNewDoctor";
// import { useAuth } from "../../context/appContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../../context/appContext";
import DashboardCharts from "../charts/dashboardCharts";
import AddNewDoctor from "./addNewDoctor";
import AdminNavbar from "./AdminNavbar";
import useConfirmAction from "../../../utils/customConfirmAction";

interface BookedSlot {
    isBooked: boolean,
    isCancelled: boolean,
    isCompleted: boolean,
    doctorId: string,
    patientId: string,
    patientName: string,
    doctorName: string,
    source: string,
    slotDate: {
        startDate: string,
        endDate?: string
    },
    slotTime: string,
    _id: string
}

const AdminHome = () => {

    type Tabs = 'Dashboard' | 'Appointments' | 'New Doctor' | 'More';
    const tabsList: Tabs[] = ['Dashboard', 'Appointments', 'New Doctor', "More"];
    const { bookedSlots, setBookedSlots, userRole } = useAuth();
    const [activeTab, setActiveTab] = useState<Tabs>(() => {
        try {
            const currentTab = localStorage.getItem('ActiveTab') || 'Dashboard';
            if (currentTab && tabsList.includes(currentTab as Tabs)) {
                ;
                return currentTab as Tabs
            }
        }
        catch (err) {
            console.error("error while fetching localStored active Tab ", err);
        }
        return 'Dashboard'
    });

    const {isAuthenticated} = useAuth();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const stylingOfMain = `w-full max-w-5xl bg-white rounded-xl shadow-sm border border-gray-200 p-6 my-4 mx-auto transition-opacity duration-300`;
    async function handleAppointment(action: string, slotId: string, docId: string) {
        if(!isAuthenticated){
            toast.error("You Have To Login Again To Proceed Further");
            return;
        }
        const confirmAction = useConfirmAction(action);
        const confirm = await confirmAction;
        if (confirm) {
            const toastId = toast.loading(`${action} slot, please wait..`);
            try {
                let response;
                
                response = await axios.post(`${backendUrl}/pms/updateSlotStatus/${slotId}`,
                    {
                        action,
                        docId,
                        role: userRole
                    },
                    {
                        withCredentials: true
                    }
                )
                if (response.data.success) {
                    toast.success(`Successful Slot ${action} operation`, { id: toastId })
                    if (response.data.updatedSlots.length) {
                        const updatedSlots = response.data.updatedSlots;
                        localStorage.setItem('bookedSlots', JSON.stringify(updatedSlots));
                        const parsedBookedSlots = updatedSlots.map((slots: BookedSlot) => (
                            {
                                ...slots,
                                slotDate: {
                                    startDate: new Date(slots.slotDate.startDate),
                                    endDate: slots.slotDate.endDate ? new Date(slots.slotDate.endDate) : undefined,
                                }
                            }
                        ))
                        setBookedSlots(parsedBookedSlots)
                    }
                }

            }
            catch (err) {
                toast.error(`error while making appointment ${action} request`, {id:toastId})
                console.error(`got error while making an appointment ${action} request`, err);
            }
        }

    }

    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                <AdminNavbar />
                <nav className="w-full max-w-5xl mx-auto py-4 px-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <button
                            aria-selected={activeTab === 'Dashboard'}
                            onClick={() => {
                                setActiveTab('Dashboard')
                                localStorage.setItem('ActiveTab', 'Dashboard')
                            }
                            }
                            className={`flex items-center justify-center gap-2 p-3 
                                rounded-lg shadow-sm border transition-all 
                                duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none 
                                ${activeTab === 'Dashboard' ? 'bg-blue-50 border-blue-500 shadow-md scale-[1.02]' : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'}`}
                        >
                            <LayoutDashboardIcon className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-700">Dashboard</span>
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('Appointments')
                                localStorage.setItem('ActiveTab', 'Appointments')
                            }
                            }
                            aria-selected={activeTab === 'Appointments'}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg shadow-sm 
                                border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none 
                                ${activeTab === 'Appointments' ? 'bg-blue-50 border-blue-500 shadow-md scale-[1.02]' : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'}`}
                        >
                            <BookAIcon className="w-5 h-5 text-blue-600" />
                            <span className={`font-medium text-gray-700 `}>Appointments</span>
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('New Doctor');
                                localStorage.setItem('ActiveTab', 'New Doctor')
                            }}
                            aria-selected={activeTab === 'New Doctor'}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg shadow-sm border 
                            transition-all duration-200 
                            focus:ring-2 focus:ring-blue-500 focus:outline-none
                             ${activeTab === 'New Doctor' ? 'bg-blue-50 border-blue-500 shadow-md scale-[1.02]' : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'}`}>
                            <User className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-700">
                                Add New Doctor
                            </span>
                        </button>
                        {/* <button
                            onClick={() => {
                                setActiveTab('More');
                                localStorage.setItem('ActiveTab', 'More')
                            }}
                            aria-selected={activeTab === 'More'}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg shadow-sm border 
                            transition-all duration-200 
                            focus:ring-2 focus:ring-blue-500 focus:outline-none
                             ${activeTab === 'More' ? 'bg-blue-50 border-blue-500 shadow-md scale-[1.02]' : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'}`}>
                            <User className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-700">
                                More
                            </span>
                        </button> */}
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
                                            <span className="w-6 h-6"> Rs </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Revenue Monthly</p>
                                            <p className="text-2xl font-semibold text-gray-800">Rs 26,55300</p>
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
                                <div className="hidden bg-blue-50 border-blue-500 shadow-md scale-[1.02]" />

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
                        <section className="px-4 pb-6">
                            <header>
                                <h1 className="border-b border-gray-200 px-2 py-5 text-blue-600 shadow-md text-xl hover:border-gray-300 hover:shadow-lg transition-all duration-200"> Recent Appointments</h1>
                            </header>
                            <div className="booking-item overflow-x-auto">
                                <table className="min-w-max w-full border border-gray-200 rounded-lg overflow-hidden" cellPadding="10" cellSpacing="0" >
                                    <thead className="border border-gray-100 text-sm md:text-base">
                                        <tr>
                                            <th className="text-left text-xl px-3 py-2 text-gray-600 font-medium border-b">Patient</th>
                                            <th className="text-left px-3 py-2 text-gray-600 font-medium border-b">Doctor</th>
                                            <th className="text-left px-3 py-2 text-gray-600 font-medium border-b">Date</th>
                                            <th className="text-left px-3 py-2 text-gray-600 font-medium border-b">Fee</th>
                                            <th className="text-left px-3 py-2 text-gray-600 font-medium border-b">Status</th>
                                            <th className="text-left px-3 py-2 text-gray-600 font-medium border-b">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookedSlots && bookedSlots?.map((slot, index) => (
                                            <tr key={index}>
                                                <td className="px-3 py-2 border-b text-gray-700">{slot.patientName}</td>
                                                <td className="px-3 py-2 border-b text-gray-700">{slot.doctorName} </td>
                                                <td className="px-3 py-2 border-b text-gray-700 whitespace-nowrap">{slot.slotDate.startDate.toLocaleString()}</td>
                                                <td className="px-3 py-2 border-b text-gray-700">Rs 4000</td>
                                                <td
                                                    className={`px-6 py-4 border-b font-medium text-sm
                                                        ${slot.isCompleted && "text-green-600"} ${slot.isCancelled && 'text-red-600'} ${slot.isBooked && 'text-blue-600'}`}
                                                >{slot.isBooked && 'Pending' || slot.isCancelled && 'Cancelled' || slot.isCompleted && 'Completed'}</td>
                                                <td className="px-3 py-2 md:px-6 md:py-4 border-b">

                                                    {slot.isBooked &&
                                                        <div className="flex">
                                                            <button title="delete" onClick={() => handleAppointment('cancel', slot._id, slot.doctorId)}
                                                                className="relative group px-3 py-2 md:px-6 md:py-4 border-b shadow-lg text-gray-700"
                                                            >
                                                                <Delete className="text-red-500" size={18} />
                                                                <span className="absolute bottom-full left-1/2 text-xs whitespace-nowrap 
                                                                 transform -translate-x-1/2 invisible group-hover:visible
                                                                 bg-gray-800 text-white opacity-0 rounded-lg p-1 
                                                                 group-hover:opacity-100 transition duration-300 ease-in-out">cancel</span>
                                                            </button>
                                                            {/* <div className="flex group relative"> */}

                                                            <button onClick={() => handleAppointment('complete', slot._id, slot.doctorId)}

                                                                className="flex group relative p-1 md:px-6 md:py-4 border-b shadow-lg text-gray-700"
                                                            >
                                                                <Check className="text-green-500" size={18} />
                                                                <span className="absolute bottom-full left-1/2 text-xs whitespace-nowrap 
                                                                 transform -translate-x-1/2 invisible group-hover:visible
                                                                 bg-gray-800 text-white opacity-0 rounded-lg p-1 
                                                                 group-hover:opacity-100 transition duration-300 ease-in-out">Completed</span>
                                                            </button>
                                                            {/* </div> */}
                                                        </div>
                                                    }

                                                    {(slot.isCompleted || slot.isCancelled) &&
                                                        <div className="text-center">
                                                            <button onClick={() => handleAppointment('remove', slot._id, slot.doctorId)}
                                                                className="relative group px-3 py-2 md:px-6 md:py-4 border-b text-gray-700"
                                                            >
                                                                <Trash className="text-red-500" size={18} />
                                                                <span className="absolute bottom-full left-1/2 text-xs whitespace-nowrap 
                                                                 transform -translate-x-1/2 invisible group-hover:visible
                                                                 bg-gray-800 text-white opacity-0 rounded-lg p-1 
                                                                 group-hover:opacity-100 transition duration-300 ease-in-out">Remove</span>
                                                            </button>

                                                        </div>
                                                    }

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                            <button
                                className="text-gray-800 border border-gray-400 p-2 rounded-md mt-6 text-sm hover:border-purple-700 hover:text-purple-700">
                                Load More
                            </button>
                        </section>
                    </main>
                    {/* Profile */}
                    <main className={`h-fit ${stylingOfMain} ${activeTab === 'New Doctor' ? 'opacity-100 relative' : 'opacity-0 absolute pointer-events-none'}`}>
                        <AddNewDoctor />
                    </main>
                    {/* <main className={`${stylingOfMain} ${activeTab === 'More' ? 'opacity-100 relative' : 'opacity-0 absolute pointer-events-none'}`}>
                        <div>
                            <p>Generate doctor slots for the next 14 days</p>
                            <button 
                            type="button" 
                            className="border border-gray-400 px-4 py-2 rounded-lg hover:border-purple-700 hover:text-purple-800">
                                Generate
                            </button>
                        </div>
                    </main> */}
                </div>
            </div>
        </>
    )
}

export default AdminHome