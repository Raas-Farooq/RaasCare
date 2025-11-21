import Navbar from "../Components/Navbar/navbar";
import useImageCached from "./useImageCached";



const TopFacilities = () => {


    const care = useImageCached('/patientCareNew.webp');
    const doctors = useImageCached('/patientFacilitiesDoctors.webp');
    const counselling = useImageCached('/topFacilitiesCounselling.webp');
    const international = useImageCached('/internationalPatients.webp');
 


    const headingStyle = "text-xl m-5 px-2 border-b w-full object-contain border-gray-300 text-blue-500";
    const BaseContainerStyle = 'flex flex-col md:flex-row items-center gap-6 px-4';
    const paragraphStyles = "text-left md:text-justify max-w-xl mx-auto md:mx-0 tracking-tight leading-relaxed text-center";
    const imageDivContainer = `relative w-full max-h-[600px]`;
    const BaseImageStyling = "w-full object-contain sm:w-full md:w-full lg:w-2/3 rounded-lg shadow-md shadow-transition hover:scale-105 transition-all duration-700";

    return (
        <div className="relative bg-gray-50">

            <Navbar />
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-purple-500 text-4xl my-8 font-bold">Built For Ease And Comfort</h1>
                    <p className={`text-center text-justify max-w-5xl sm:text-lg text-gray-600 px-4`}>
                        It streamlines the process by enabling users to search for providers, view their availability, book slots, and receive reminders, which significantly simplifies managing their schedules and makes healthcare or other services more accessible
                        aims to provide a user-friendly scheduling experience that saves time and reduces stress for both clients and businesses by streamlining the process of booking, rescheduling, and canceling appointments. Key features contributing to this experience include an intuitive interface, 24/7 self-service booking, automated notifications, real-time availability, a mobile-first design, and integrated payments.
                    </p>
                </div>
                <section className="animate-fadeIn w-full py-16 bg-white">
                    {/* <h1 className="text-blue-600 text-4xl m-5 border-b border-gray-200">One of The Superior and Extensive Patient Care</h1> */}
                    <div className={`${BaseContainerStyle} md:justify-between`} >
                        <div className="w-2/3">
                            <h1 className={`${headingStyle} `} > One of The Superior and Extensive Patient Care</h1>
                            <p className={`${paragraphStyles}`}>Good patient care involves a comprehensive approach that considers the patient's physical, emotional, and mental well-being. It involves clear communication, building trust, and personalized treatment plans that take into account the patient's unique needs and preferences</p>
                        </div>
                        <div className={`${imageDivContainer} flex justify-end`}>
                            {care.imageLoaded === 'loading' &&
                                <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"> </div>
                            }
                            <img

                                src="/patientCareNew.webp" loading="lazy"
                                className={`${BaseImageStyling} ${care.imageLoaded === 'loaded' ? 'block' : 'hidden'}`}
                                alt="Patient Care" />

                            {care.imageLoaded === 'failed' && (
                                <div className="text-red-500">
                                    Failed to load image.
                                </div>
                            )}

                        </div>

                    </div>
                </section>

                <section className="bg-gray-50 w-full py-16">

                    <div className={`${BaseContainerStyle} md:flex-row-reverse`}>

                        <div className="w-2/3">
                            <h1 className={`${headingStyle}`} >Renowned and highly Recommended Doctors</h1>
                            <p className={`${paragraphStyles}`}>
                                Good patient care involves a comprehensive approach that considers the patient's physical, emotional, and mental well-being. It involves clear communication, building trust, and personalized treatment plans that take into account the patient's unique needs and preferences
                            </p>
                        </div>
                        <div className={`${imageDivContainer}`} >
                            {doctors.imageLoaded === 'loading' &&
                                <div className="h-64 bg-gray-200 animate-pulse ">
                                </div>
                            }
                            <img src="patientFacilitiesDoctors.webp"
                                className={`${BaseImageStyling}${doctors.imageLoaded === 'loaded' ? 'block' : 'hidden'}`}
                                loading="lazy"
                            />
                            {
                                doctors.imageLoaded === 'failed' &&
                                (<div className="text-red-500">
                                    Failed to Load Image
                                </div>)
                            }
                        </div>

                    </div>

                </section>
                <section className="bg-white w-full py-16">
                        <div className={`${BaseContainerStyle}`} >
                            <div className="w-2/3">
                                <h2 className={`${headingStyle}`}>WorldWide Patients</h2>
                                <p className={`${paragraphStyles}`}>Good patient care involves a comprehensive approach that considers the patient's physical, emotional, and mental well-being. It involves clear communication, building trust, and personalized treatment plans that take into account the patient's unique needs and preferences</p>
                            </div>

                            <div className={`${imageDivContainer} flex justify-end`}>
                                {international.imageLoaded === 'loading' &&
                                    <div className="w-full h-64 bg-gray-200 animate-pulse ">
                                    </div>
                                }
                                <img
                                    src="./internationalPatients.webp"
                                    className={`${BaseImageStyling} ${international.imageLoaded === 'loaded' ? 'block' : 'hidden'}`}
                                    loading="lazy" />

                                {
                                    international.imageLoaded === 'failed' &&
                                    (<div className="text-red-500">
                                        Failed to Load Image
                                    </div>)
                                }
                            </div>
                        </div>
                </section>
                <section className="bg-gray-50 py-16 w-full">
                    <div className={`${BaseContainerStyle} md:flex-row-reverse`} >
                        <div className="w-2/3">
                            <h1 className={`${headingStyle}`}>top Class Care with Counselling</h1>
                            <p className={`${paragraphStyles}`}>Good patient care involves a comprehensive approach that considers the patient's physical, emotional, and mental well-being. It involves clear communication, building trust, and personalized treatment plans that take into account the patient's unique needs and preferences</p>
                        </div>
                        <div className={`${imageDivContainer} `}>
                            {counselling.imageLoaded === 'loading' &&
                                <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"> </div>
                            }
                            <img

                                src="/topFacilitiesCounselling.webp" loading="lazy"
                                className={`${BaseImageStyling} 
                                ${counselling.imageLoaded === 'loaded' ? 'block' : 'hidden'}`}
                                alt="Patient Care" />

                            {counselling.imageLoaded === 'failed' && (
                                <div className="text-red-500">
                                    Failed to load image.
                                </div>
                            )}

                        </div>
                    </div>
                </section>
            </div>
        </div>
    )

}

export default TopFacilities

// https://share.google/aimode/rb3zADzj0eyszOO6q
