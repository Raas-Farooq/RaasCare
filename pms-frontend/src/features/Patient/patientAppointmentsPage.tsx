import { useEffect } from "react";
import { useAuth } from "../../context/appContext"
import { Check, Delete, Trash } from "lucide-react";
import axios from "axios";
import makeNgrokRequest from "../../ngrokRequesthook";


const MyAppointments = () => {

    const {bookedSlots} = useAuth();

    useEffect(() => {
        console.log("slots booked: ",bookedSlots);

    }, [bookedSlots])

    const handleAppointment = (action:string, slotId:string) => {
        console.log("handle Appointment clicked!");
    }
    async function handlePayOnline(fee:number, slotId:string){
      console.log("online pay clicked", fee, "slotId ", slotId);
      const doctorId='39784sdj'

      const body = {
        amount: fee,
        doctorId:doctorId
      }

      try{
        const paymentRequest = await makeNgrokRequest({url:`pms/onlinePaymentRequest/${slotId}`, method:'post', data:body});
        console.log("Payment Request ", paymentRequest);
        if(paymentRequest.data.success){
          console.log("success inside froentend ");
          const redirectUrl = paymentRequest.data.redirectUrl;
          console.log(" outside redirect Url ", redirectUrl);
          if(redirectUrl){
            console.log(" Yes indeeeed redirect Url ", redirectUrl);
            // window.location.replace(redirectUrl);
            window.location.href=redirectUrl
          }
          else {
            console.warn("redirect Url is missing")
          }
        }
      }
      catch(err){
        console.log(" unable to make payment request. Error: ", err);
      }
    }
    return (
        <div>
            <h1 className="text-center font-light text-3xl mb-5 mt-3"> My Appointments </h1>
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
                              <button onClick={() => handlePayOnline(3000, slot._id) } className="text-sm font-normal text-blue-400 hover:text-blue-600 font-base"> Pay Online</button>
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