import { useEffect } from "react";
import { useAuth } from "../../context/appContext"
import { Check, Delete, Trash } from "lucide-react";


const MyAppointments = () => {

    const {bookedSlots} = useAuth();

    useEffect(() => {
        console.log("slots booked: ",bookedSlots);

    }, [bookedSlots])

    const handleAppointment = (action:string, slotId:string) => {
        console.log("handle Appointment clicked!");
    }
    return (
        <div>
            <h1> my appointments </h1>
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
                        {/* <td className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700">{doctorProfile?.consultationFee}</td> */}
                        <td
                          className={` text-yellow-600  px-6 py-4 border-b font-medium ${slot.isCompleted
                            && "text-green-600"} ${slot.isCancelled && 'text-red-600'}`}
                        >{slot.isBooked && 'Pending' || slot.isCancelled && 'Cancelled' || slot.isCompleted && 'Completed'}</td>
                        <td className="px-3 py-2 md:px-6 md:py-4 border-b">

                          {slot.isBooked &&
                            <div>
                              <p className="text-sm font-normal font-base"> Not Paid</p>
                            </div>
                          }

                          {/* {(slot.isCompleted || slot.isCancelled) &&
                            <div className="text-center">
                              <button onClick={() => handleAppointment('remove', slot._id)}
                                className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700"
                              >
                                <Trash className="text-red-500" size={15} />
                              </button>

                            </div>
                          } */}

                        </td>
                        <td>
                          {slot.isBooked &&
                            <div>
                              <button className="text-sm font-normal text-blue-400 hover:text-blue-600 font-base"> Pay Online</button>
                            </div>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        </div>
    )
}

export default MyAppointments