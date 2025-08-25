import { useEffect, useState } from "react";

import { LayoutDashboardIcon, BookAIcon, User, DollarSignIcon, Users, UserIcon, Check, Delete, DeleteIcon, CircleX, CheckCircle } from "lucide-react";
import DoctorNavbar from "./DoctorNavbar";
import { useAuth } from "../../context/appContext";
import axios from "axios";


const DoctorHome = () => {
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Appointments' | 'Profile'>('Dashboard');
  const { setDoctorProfile } = useAuth();
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

  const { doctorProfile } = useAuth();

  // const navigate = useNavigate();
  // const handleAddPatientClick = () => {
  //   navigate('/doctor-dashboard/addPatient')
  // }

  useEffect(() => {

  }, [])


  async function handleAppointment(action: string, patientId: string, day: string, time: string) {
    console.log("Cancel clicked ", action)
    console.log("day ", day, "tim ", time, patientId,);
    if (!day || !time) {
      alert("please provide the day and time of cancelling appointment");
      return;
    }
    if (!patientId) {
      alert("For cancelling Appointment patient Id is required");
      alert;
    }

    try {
      let response;
      if (action === 'cancel') {
        response = await axios.post(`http://localhost:2500/pms/cancelAppointment/${doctorProfile?._id}`,
          {
            patientId,
            slotDay: day,
            slotTime: time
          },
          { withCredentials: true }
        )
      }
      else {
        response = await axios.post(`http://localhost:2500/pms/completeAppointment/${doctorProfile?._id}`,
          {
            patientId,
            slotDay: day,
            slotTime: time
          },
          { withCredentials: true }
        )
      }

      console.log("response: ", response);
      if (response.data.success) {
        const data = response.data;
        setDoctorProfile(data.updatedProfile);
        localStorage.setItem('doctorProfile', JSON.stringify(
          data.updatedProfile
        ))
      }

    }
    catch (err) {
      console.error("got error while making request", err);
    }
  }

  const stylingOfMain = `w-full max-w-5xl bg-white rounded-xl shadow-sm border border-gray-200 p-6 my-4 mx-auto transition-opacity duration-300`

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <DoctorNavbar />
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
                Profile
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
                      <p className="text-sm text-gray-500">Earnings</p>
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
                    {doctorProfile?.availableDays?.map((slotsData, index) => (
                      <div key={index}>
                        {slotsData.slots?.map((slot, slotIndex) => (
                          <div key={slotIndex} className="flex items-center space-x-4">
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
                                          onClick={() => handleAppointment('complete', slot.patientId as string, slotsData.day, slot.slotTime)}
                                          className="text-green-500 text-xs hover-shadow-lg hover:scale-105 transition-transform duration-200">
                                          <CheckCircle />
                                        </button>
                                        <button
                                          onClick={() => handleAppointment('cancel', slot.patientId as string, slotsData.day, slot.slotTime)}
                                          className="text-red-500 text-xs hover-shadow-lg hover:scale-105 transition-transform duration-200">
                                          <CircleX />
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
                                  </div>
                                  <div className="mb-10">
                                    <p className="text-sm text-gray-500">{doctorProfile.speciality} - {slot.slotTime}</p>
                                    <h2 className="text-sm text-gray-500">{slotsData.day}</h2>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
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
          <main className={`${stylingOfMain} ${activeTab === 'Profile' ? 'opacity-100 relative' : 'opacity-0 absolute pointer-events-none'}`}>
            <section className="flex flex-col gap-8">
              <div className="flex-shrink-0">
                <img
                  src={doctorProfile?.profileImage.imageUrl}
                  alt={`Dr. ${doctorProfile?.username}`}
                  className="object-cover rounded-lg w-full max-w-xs shadow-md h-auto" />
              </div>
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
                <span className="text-gray-600 font-medium">Fee</span>
                <p className="text-gray-700 text-lg font-medium">{doctorProfile?.consultationFee} Rs</p>
              </div>
              <div>
                <span className="block text-gray-600 font-medium">About</span>
                <p className="text-gray-700"> {doctorProfile?.about}</p>
              </div>
              <div className="flex">
                <span className="block text-gray-700 font-medium">Address</span>
                <p className="text-gray-700 text-md rounded-md w-fit ml-3 font-thin">{doctorProfile?.address}</p>
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