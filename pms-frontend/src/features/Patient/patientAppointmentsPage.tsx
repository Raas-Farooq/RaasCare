
import { useAuth } from "../../context/appContext"
import { useNavigate, useLocation } from "react-router-dom";
import makeRequest from "../../makeRequesthook";
import { useEffect } from "react";


const MyAppointments = () => {

  const { bookedSlots, setBookedSlots} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const origin = location.state?.origin;

  useEffect(() => {
    const filterdSlots = bookedSlots?.filter(slot => !(slot.isArchived)) || null;
    setBookedSlots(filterdSlots)
  },[])

  async function handlePayOnline(fee: number, slotId: string) {
    const doctorId = '39784sdj'

    const body = {
      amount: fee,
      doctorId: doctorId
    }

    try {
      const paymentRequest = await makeRequest({ url: `pms/onlinePaymentRequest/${slotId}`, method: 'post', data: body });

      if (paymentRequest.data.success) {

        const redirectUrl = paymentRequest.data.redirectUrl;

        if (redirectUrl) {
          // window.location.replace(redirectUrl);
          window.location.href = redirectUrl
        }
        else {
          console.warn("redirect Url is missing")
        }
      }
    }
    catch (err) {
      console.error(" unable to make payment request. Error: ", err);
    }
  }

  return (
    <div>
      <h1 className="text-center text-3xl text-purple-500 mb-5 mt-3 font-bold"> My Appointments </h1>
      <div className="booking-item overflow-x-auto">
        {bookedSlots && bookedSlots.length ?
          (<table className="min-w-max w-full border border-gray-200 rounded-lg overflow-hidden" cellPadding="10" cellSpacing="0" >
            <thead className="border border-gray-100 bg-purple-50 text-gray-800 text-sm md:text-base">
              <tr>
                <th className="text-left px-3 py-2 md:px-6 md:py-3 font-bold border-b">Patient </th>
                <th className="text-left px-3 py-2 md:px-6 md:py-3 font-medium border-b">Doctor</th>
                <th className="text-left px-3 py-2 md:px-6 md:py-3 font-medium border-b">Date</th>
                <th className="text-left px-3 py-2 md:px-6 md:py-3 font-medium border-b">Status</th>
                <th className="text-left px-3 py-2 md:px-6 md:py-3 font-medium border-b">Fee</th>
                <th className="text-left px-3 py-2 md:px-6 md:py-3 font-medium border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookedSlots?.map((slot, index) => {
                // const formattedDate = slot.slotDate.startDate.toLocaleString('en-US', options);
                return (
                  <tr key={index}>
                    <td className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700">{slot.patientName}</td>
                    <td className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700">Dr. {slot.doctorName} </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700 whitespace-nowrap">
                      <div className="flex flex-col text-sm">
                        <span>{slot?.slotDate?.startDate.getDate()} - {slot?.slotDate?.startDate.toLocaleString('default', { month: 'short' })}</span>
                        <span>{slot.slotTime}
                        </span>
                      </div>
                    </td>
                    {/* <td className="px-3 py-2 md:px-6 md:py-4 border-b text-gray-700">{doctorProfile?.consultationFee}</td> */}
                    <td
                      className={` text-yellow-600  px-6 py-4 border-b font-medium ${slot.status === "completed"
                        && "text-green-600"} ${slot.status === "cancelled" && 'text-red-600'}`}
                    >{slot.status === "booked" && 'Pending' || slot.status === "cancelled" && 'Cancelled' || slot.status === "completed" && 'Completed'}</td>
                    <td className="px-3 py-2 md:px-6 md:py-4 border-b">

                      {(slot.status === "booked" || slot.status === "cancelled") &&
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
                      {slot.status === "booked" &&
                        <div>
                          <button onClick={() => handlePayOnline(3000, slot._id)} className="text-sm font-normal text-blue-400 hover:text-blue-600 font-base"> Pay Online</button>
                        </div>
                      }
                    </td>
                  </tr>
                )
              }

              )}
            </tbody>
          </table>
          )
          :
          (
            <h2 className="text-center">
              User didn't have any appointment Yet
            </h2>
          )}
      </div>
      <div className="flex flex-col mt-24">
        {origin ? <button onClick={() => navigate(origin, { replace: true })} className="text-gray-600 hover:text-gray-900 hover:underline"> Back to Doctor Profile </button> : ''}
        <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900 hover:underline"> Back to Home</button>
      </div>
    </div>
  )
}

export default MyAppointments