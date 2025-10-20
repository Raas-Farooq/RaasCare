import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/navbar"




const NursingCare = () => {

    const navigate = useNavigate();

    const headingStyle = "text-xl m-5 px-2 border-b w-full object-contain border-gray-300";
    const BaseImageStyling = "w-full h-full object-contain sm:w-full md:w-full rounded-lg shadow-md shadow-transition hover:scale-105 transition-all duration-700";
    const BaseContainerStyle = 'flex flex-col md:flex-row items-center gap-6 px-4';
    const paragraphStyles = "max-w-xl mx-auto md:mx-0 tracking-tight leading-relaxed text-center";

    return (
        <div className="relative bg-gray-50 font-sans text-gray-800">
            <Navbar />
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-purple-600 text-4xl sm:text-5xl font-bold tracking-tight my-4">World-Class Nursing Care</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        It streamlines the process by enabling users to search for providers, view their availability, book slots, and receive reminders, which significantly simplifies managing their schedules and makes healthcare or other services more accessible. The goal is to provide a user-friendly scheduling experience that saves time and reduces stress for both clients and businesses by streamlining the process of booking, rescheduling, and canceling appointments.
                    </p>
                </div>

                <section className="animate-fadeIn py-16">
                    <div className={`${BaseContainerStyle} flex-col-reverse md:flex-row`} >
                        <div className="md:w-1/2 flex flex-col justify-center">
                            <h2 className={`${headingStyle} text-3xl md:text-4xl text-blue-600`}>One of The Superior and Extensive Patient Care</h2>
                            <p className={`${paragraphStyles} md:text-left`}>Good patient care involves a comprehensive approach that considers the patient's physical, emotional, and mental well-being. It involves clear communication, building trust, and personalized treatment plans that take into account the patient's unique needs and preferences.</p>
                        </div>
                        <div className={`relative w-full md:w-1/2 max-h-[600px] flex justify-center items-center`}>
                            <img
                                src="/bestNursing.jpg"
                                loading="lazy"
                                className={`${BaseImageStyling} max-w-md w-full`}
                                alt="Patient Care" />
                        </div>
                    </div>
                </section>
                <div className="w-full text-center">
                    <button className="text-center text-gray-500 hover:text-blue-500 hover:underline" type="button" onClick={()=> navigate(-1)}> Back</button>
                </div>
            </div>
        </div>

    )

}

export default NursingCare