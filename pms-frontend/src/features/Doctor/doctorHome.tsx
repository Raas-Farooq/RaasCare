import { useEffect, useState } from "react";

import { LayoutDashboardIcon, BookAIcon, User, DollarSignIcon, Users, UserIcon, Check, Delete, CircleX, CheckCircle, Trash, IndianRupee } from "lucide-react";
import DoctorNavbar from "./DoctorNavbar";
import { useAuth } from "../../context/appContext";
import axios from "axios";
import toast from "react-hot-toast";
import PatientAddForm from "../Patient/addPatient";
import HandleAxiosError from "../../utils/handleAxiosError";
import { FaRupeeSign } from "react-icons/fa";

interface BookedSlot {
  isBooked: boolean,
  isCancelled: boolean,
  isCompleted: boolean,
  doctorId: string,
  patientId: string,
  doctorName: string,
  patientName: string,
  source: string,
  slotDate: {
    startDate: string,
    endDate?: string
  },
  slotTime: string,
  _id: string
}
type ActiveTabType = 'Dashboard' | 'Appointments' | 'Profile' | 'AddPatient'
// Add Patient Tab Have to Be Added
const backend_url = import.meta.env.VITE_BACKEND_URL;
const DoctorHome = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('Dashboard');
  const { doctorProfile, bookedSlots, setBookedSlots, userRole } = useAuth();

  function syncUpdatedSlots(updatedSlots: BookedSlot[]) {
    console.log("sync Updated slots runs: ", updatedSlots);
    const updated = updatedSlots.map((slots: BookedSlot) => (
      {
        ...slots,
        slotDate: {
          startDate: new Date(slots.slotDate.startDate),
          endDate: slots.slotDate.endDate ? new Date(slots.slotDate.endDate) : undefined,
        }
      }
    ))
    setBookedSlots(updated);
    return updated;

  }

  const storeTabLocally = (tab: ActiveTabType) => {
    localStorage.setItem(`storedTab`, tab);
  }
  useEffect(() => {

    const storedTab = localStorage.getItem('storedTab');
    if (storedTab) {
      setActiveTab(storedTab as ActiveTabType)
    }
  }, [])

  async function handleAppointment(action: string, slotId: string) {
    const toastId = toast.loading('updating slot Status')
    try {
      let response;
      response = await axios.post(`${backend_url}/pms/updateSlotStatus/${slotId}`,
        {
          action,
          docId: doctorProfile?._id,
          role: userRole
        },
        { withCredentials: true }
      )
      if (response.data.success) {
        toast.dismiss();
        toast.success(`successfully ${action}ed the Slot`, { id: toastId })
        if (response.data.updatedSlots.length) {
          const updatedSlots = response.data.updatedSlots;
          // storing locally
          if (updatedSlots.length > 0) {
            localStorage.setItem('bookedSlots', JSON.stringify(updatedSlots));
            localStorage.setItem('bookedSlots', JSON.stringify([]));
            syncUpdatedSlots(updatedSlots)
          }
        }
      }

    }
    catch (err) {
      let errorMessage = HandleAxiosError(err);
      toast.error(errorMessage, { id: toastId });
    }
  }

  const stylingOfMain = `w-full max-w-5xl bg-white rounded-xl shadow-sm border border-gray-200 p-6 my-4 mx-auto transition-opacity duration-300`

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <DoctorNavbar />
        <nav className="w-full max-w-5xl mx-auto py-4 px-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button
              aria-selected={activeTab === 'Dashboard'}
              onClick={() => {
                setActiveTab('Dashboard');
                storeTabLocally('Dashboard')
              }}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none
                 ${activeTab === 'Dashboard' ? 'bg-blue-50 border border-blue-500 shadow-md scale-[1.02]' : 'bg-white border border-gray-200'}`}
            >
              <LayoutDashboardIcon className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Dashboard</span>
            </button>
            <button
              onClick={() => {
                storeTabLocally('Appointments')
                setActiveTab('Appointments')
              }
              }
              aria-selected={activeTab === 'Appointments'}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none
                 ${activeTab === 'Appointments' ? 'bg-blue-50 border border-blue-500 shadow-md scale-[1.02]' : 'bg-white border border-gray-200'}`}
            >
              <BookAIcon className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Appointments</span>
            </button>
            <button
              aria-selected={activeTab === 'AddPatient'}
              onClick={() => {
                storeTabLocally('AddPatient')
                setActiveTab('AddPatient')
              }
              }
              // aria-selected={activeTab === 'Dashboard'}
              // onClick={() => setActiveTab('Dashboard')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none 
                ${activeTab === 'AddPatient' ? 'bg-blue-50 border border-blue-500 shadow-md scale-[1.02]' : 'bg-white border border-gray-200'}`}
            >
              <LayoutDashboardIcon className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Add Patient</span>
            </button>
            <button
              onClick={() => {
                storeTabLocally('Profile')
                setActiveTab('Profile')
              }}
              aria-selected={activeTab === 'Profile'}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none 
              ${activeTab === 'Profile' ? 'bg-blue-50 border border-blue-500 shadow-md scale-[1.02]' : 'bg-white border border-gray-200'}`}>
              <User className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">
                Profile
              </span>
            </button>
          </div>
        </nav>
        <div className="w-full flex relative justify-center">
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
                      <p className="text-sm text-gray-500">Earnings</p>
                      <p className="text-2xl font-semibold text-gray-800">78,345</p>
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
                      <p className="text-sm text-gray-500">Appointments</p>
                      <p className="text-2xl font-semibold text-gray-800">24</p>
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
                      <p className="text-sm text-gray-500">Patients</p>
                      <p className="text-2xl font-semibold text-gray-800">156</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="px-6 pb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-800">Latest Bookings</h2>
                </div>
                <div className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex flex-col w-full justify-between">
                    {/* {bookedSlots && bookedSlots.map((slot,ind) => {
                    return (
                      <div>
                        {slot.patientName}
                      </div>
                    )
                  })} */}
                    {bookedSlots && bookedSlots.map((slot, index) => (
                      <div key={index}>
                        <div className="flex items-center space-x-4">
                          {(slot.isBooked || slot.isCancelled || slot.isCompleted) && (
                            <div>
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-gray-500" />
                              </div>
                              <h3 className="">{slot.patientName}</h3>
                              <div className="grid grid-cols-2 justify-between">
                                <div className="font-medium text-gray-800">
                                  {(!(slot.isCompleted) && slot.isBooked) &&
                                    <div className="flex gap-4">
                                      <button
                                        onClick={() => handleAppointment('complete', slot._id)}
                                        className="group text-green-500 text-xs hover-shadow-lg hover:scale-105 transition-transform duration-200">
                                        <CheckCircle />
                                        <span className="absolute invisible opacity-0 
                                        group-hover:visible group-hover:opacity-100 text-xs text-white bg-slate-800 
                                        px-1 left-1/2 -translate-x-1/2 top-7 rounded-full transition-all duration-300"
                                        > Complete </span>
                                      </button>
                                      <button
                                        onClick={() => handleAppointment('cancel', slot._id)}
                                        className="group text-red-500 text-xs hover-shadow-lg hover:scale-105 transition-transform duration-200">
                                        <CircleX />
                                        <span className="absolute invisible opacity-0 
                                        group-hover:visible group-hover:opacity-100 text-xs text-white bg-slate-800 
                                        px-1 left-1/2 -translate-x-1/2 top-7 rounded-full transition-all duration-300"
                                        > delete </span>
                                      </button>
                                    </div>
                                  }
                                  {slot.isCancelled && (
                                    <div>
                                      <p className="text-pink-500 text-xs">cancelled</p>
                                    </div>
                                  )}
                                  {slot.isCompleted && (
                                    <div>
                                      <p className="text-green-500 text-xs">completed</p>
                                    </div>
                                  )}
                                  {(slot.isCancelled || slot.isCompleted) &&
                                    <div>
                                      <button onClick={() => handleAppointment('remove', slot._id)}
                                        className="group relative">
                                        <Trash className="text-red-400" size={20} />
                                        <span className="absolute invisible opacity-0 
                                        group-hover:visible group-hover:opacity-100 text-xs text-white bg-slate-800 
                                        px-1 left-1/2 -translate-x-1/2 top-6 rounded-full transition-all duration-300"
                                        > remove </span>
                                      </button>
                                    </div>
                                  }
                                </div>
                                <div className="mb-10">
                                  <p className="text-sm text-gray-500">{doctorProfile?.speciality} - {slot.slotTime}</p>
                                  {slot?.slotDate && (<h2 className="text-sm text-gray-500">{slot?.slotDate?.startDate.getDate()} - {slot?.slotDate?.startDate.toLocaleString('default', { month: 'short' })} </h2>)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                      <th className="text-left px-3 py-2 md:px-6 md:py-3 text-gray-600 font-medium border-b">Payment</th>
                      <th className="text-left px-3 py-2 md:px-6 md:py-3 text-gray-600 font-medium border-b">Date</th>
                      <th className="text-left px-3 py-2 md:px-6 md:py-3 text-gray-600 font-medium border-b">Fee</th>
                      <th className="text-left px-3 py-2 md:px-6 md:py-3 text-gray-600 font-medium border-b">Status</th>
                      <th className="text-left px-3 py-2 md:px-6 md:py-3 text-gray-600 font-medium border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookedSlots && bookedSlots?.map((slot, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700">{slot.patientName}</td>
                        <td className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700">{index < 3 ? 'cash' : 'online'} </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700 whitespace-nowrap">{slot.slotDate.startDate.toLocaleString()}</td>
                        <td className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700">{doctorProfile?.consultationFee}</td>
                        <td
                          className={` text-yellow-600  px-6 py-4 border-b font-medium ${slot.isCompleted
                            && "text-green-600"} ${slot.isCancelled && 'text-red-600'}`}
                        >{slot.isBooked && 'Pending' || slot.isCancelled && 'Cancelled' || slot.isCompleted && 'Completed'}</td>
                        <td className="px-3 py-2 md:px-6 md:py-4 border-b">

                          {slot.isBooked &&
                            <div>
                              <button onClick={() => handleAppointment('cancel', slot._id)}
                                className="group relative px-3 py-2 md:px-6 md:py-4 border-b text-gray-700"
                              >
                                <Delete className="text-red-500" size={15} />
                                <span className="absolute bottom-full left-1/2 text-xs whitespace-nowrap 
                                                  transform -translate-x-1/2 invisible group-hover:visible
                                                  bg-gray-800 text-white opacity-0 rounded-lg p-1 
                                                  group-hover:opacity-100 transition duration-300 ease-in-out">Delete</span>
                              </button>
                              <button onClick={() => handleAppointment('complete', slot._id)}
                                className="group relative px-3 py-2 md:px-6 md:py-4 border-b text-gray-700"
                              >
                                <Check className="text-green-500" size={15} />
                                 <span className="absolute bottom-full left-1/2 text-xs whitespace-nowrap 
                                                  transform -translate-x-1/2 invisible group-hover:visible
                                                  bg-gray-800 text-white opacity-0 rounded-lg p-1 
                                                  group-hover:opacity-100 transition duration-300 ease-in-out">Complete</span>
                              </button>
                            </div>
                          }

                          {(slot.isCompleted || slot.isCancelled) &&
                            <div className="text-center">
                              <button onClick={() => handleAppointment('remove', slot._id)}
                                className="group relative px-3 py-2 md:px-6 md:py-4 border-b text-gray-700"
                              >
                                <Trash className="text-red-500" size={15} />
                                 <span className="absolute bottom-full left-1/2 text-xs whitespace-nowrap 
                                                  transform -translate-x-1/2 invisible group-hover:visible
                                                  bg-gray-800 text-white opacity-0 rounded-lg p-1 
                                                  group-hover:opacity-100 transition duration-300 ease-in-out">
                                                    Remove</span>
                              </button>

                            </div>
                          }

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
          {/* Add New Patient */}
          <main className={`h-fit ${stylingOfMain} ${activeTab === 'AddPatient' ? 'opacity-100 relative' : 'opacity-0 absolute pointer-events-none'}`}>
            <PatientAddForm />

          </main>
          {/* Profile */}
          <main className={`${stylingOfMain} ${activeTab === 'Profile' ? 'opacity-100 relative' : 'opacity-0 absolute pointer-events-none'}`}>
            <section className="flex flex-row gap-8">
              <div className="flex-shrink-0">
                <img
                  src={doctorProfile?.profileImage.imageUrl}
                  alt={`Dr. ${doctorProfile?.username}`}
                  className="object-cover rounded-lg w-full max-w-xs shadow-md h-auto" />
              </div>
              <div className="flex flex-col space-y-8">
                <h1 className="text-2xl rounded-md font-semibold text-gray-800">Dr. {doctorProfile?.username}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    {doctorProfile?.education}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700">
                    {doctorProfile?.speciality}
                  </span>
                  <span className="px-3 py-1 bg-green-100 rounded-full text-sm text-green-700">
                    {doctorProfile?.experience} Years
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-purple-600 font-medium">Fee</span>
                  <p className="text-gray-700 text-lg font-medium">{doctorProfile?.consultationFee} Rs</p>
                </div>
                <div>
                  <span className="block text-gray-600 font-medium">About</span>
                  <p className="text-gray-700"> {doctorProfile?.about}</p>
                </div>
                <div className="flex">
                  <span className="text-gray-700 font-medium">Address</span>
                  <p className="text-gray-700 text-md rounded-md w-fit ml-3 font-mono">{doctorProfile?.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="block text-gray-600 font-medium">Available</span>
                  {doctorProfile?.available ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Yes
                    </span>
                  ) : (
                    <span className="text-red-500">No</span>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  )
}

export default DoctorHome


// Search Functionality
// const debounceSearchPatient = useMemo( 
//       () => debounce(async(value:string) => {
//         setLoadingSearchedPatients(true);
//         try{

//           const response = await axios.get(`http://localhost:2500/pms/searchPatient?search=${value}`);

//           console.log("this is the response: of searchIng,", response.data.success );
//           if(response.data.success){
//             console.log("response.data if searched response successful ", response.data);
//             setPatientsPrfiles(response.data.patients)
//           }else{
//             console.log("else Runnnn")
//             setPatientsPrfiles([]);
//           }
//         }
//         catch(err){
//           if(axios.isAxiosError(err) && err?.response?.status === 404){
//             setPatientsPrfiles([]);
//           }
//           else{
//             console.error("got error while fetching patients: ", err);
//           }

//         }
//         finally{
//           setLoadingSearchedPatients(false)
//         }
//       }, 300),
//     []);
//     const handleUserSearch = async(e:React.ChangeEvent<HTMLInputElement>) => {
//     const searchValue=e.target.value;
//     setUserSearchValue(searchValue);
//     setDoesUserSearch(true);
//     if(!searchValue || searchValue.trim() === ""){
//       setPatientsPrfiles([]);
//     }
//      debounceSearchPatient(searchValue);
//    }
//    useEffect(() => {
//     return () => {
//       debounceSearchPatient.cancel();
//     }
//    },[]);
{/* <div className='max-w-4/5 flex justify-center sm:space-x-16 relative gap-8'>
<section>
    
      <input type="search" 
      className="p-3 border border-gray-800"
      placeholder="Search Patient.."
      value={userSearchValue}
      onChange={handleUserSearch}
      name="search" />
  </section>
<div className="flex">
  <button onClick={handleAddPatientClick} className="flex gap-2 border border-gray-800 bg-purple-600 text-white text-[12px] sm:p-2 sm:text-lg sm:w-40"> New Patient <FaUserPlus /> </button>
</div>
{loadingSearchedPatients && <div><FaSpinner className="animate-spin " />   </div>}
          
            <>
              {patientsProfiles.length === 0 && doesUserSearch &&
                <div>
                  <h2>No Patient Found</h2>
                </div>
              }
            </>
<div>
  <button onClick={handleLogoutClick} className="border border-gray-600 bg-red-400 hover:bg-red-600 px-2 py-2 shadow-md rounded-full transition-transform duration-300 hover:scale-110">LogOut</button>
</div>
</div> */}