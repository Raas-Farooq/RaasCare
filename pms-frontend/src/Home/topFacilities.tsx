import { useCallback, useEffect, useState } from "react"
import makeNgrokRequest from "../ngrokRequesthook";
import { ScrollRestoration } from "react-router-dom";
import Navbar from "../Components/Navbar/navbar";
import toast from "react-hot-toast";
import { Construction } from "lucide-react";

interface ImageLoadingState{
        care:boolean,
        doctors:boolean,
        international:boolean,
        counselling:boolean
}
const TopFacilities = () => {

    
    const [count, setCount] = useState(0);
    const [imageLoaded, setImageLoaded] = useState<ImageLoadingState>(
        {care: false,
        doctors: false,
        international: false,
        counselling: false});

    type ImageName = keyof ImageLoadingState;

    const handleImageLoading = (name:ImageName) => {
        console.log("handle iamge run ", name);
        setImageLoaded((prev:ImageLoadingState) => ( 
            {
                ...prev,
                [name]:true
            }
        ))
    }
    // function stackMastery(){
    //     class Stack{
     
    //         private items:any[] = [];
            
    //         push(item:any){
    //             this.items.push(item);
    //         }

    //         pop(item:any | undefined){
    //             if(this.items.length === 0){
    //                 return 'Stack underflow'
    //             }

    //             return this.items.pop();
    //         }

    //         peek(){
    //             return this.items[this.items.length-1]
    //         }

    //         isEmpty(){
    //             return this.items.length === 0
    //         }
    //     }
    // }
    useEffect(() => {
        console.log("Top facilities are there! believe that ", imageLoaded);

    }, [imageLoaded])

    

    const handleAvgSalary = () => {
        async function getAvgSalary() {
            try {

                const response = await makeNgrokRequest({ url: 'pms/getDoctorsAverageSalary', method: 'get' });

                console.log("response of average salarY: ", response);
            } catch (err) {
                console.error("error while getting avg salary ", err);
            }
        }
        getAvgSalary();
    }
    const headingStyle = "text-xl m-5 px-2 border-b w-full object-contain border-gray-300";
    const BaseImageStyling = "w-full h-full object-contain sm:w-full md:w-3/4 md:w-full rounded-lg shadow-md shadow-transition hover:scale-105 transition-all duration-700";
    const BaseContainerStyle = 'flex flex-col md:flex-row items-center justify-between gap-6 px-4';
    const paragraphStyles = "text-left md:text-justify max-w-xl mx-auto md:mx-0 tracking-tight leading-relaxed text-center";
    // grid grid-cols-1 md:grid-cols-2 gap-5 py-5 
    const handleUsecallback = () => {
        setCount(prev => prev + 1);
    }
    // if(loadingContent){
    //     return <h1 className="text-xl text-center">Please Wait..</h1>
    // }
    return (
        <div className="relative bg-gray-50">
            
            <Navbar />
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-purple-500 text-3xl my-8">Built For Ease And Comfort</h1>
                    <p className={`text-center text-justify max-w-5xl`}>
                        It streamlines the process by enabling users to search for providers, view their availability, book slots, and receive reminders, which significantly simplifies managing their schedules and makes healthcare or other services more accessible
                        aims to provide a user-friendly scheduling experience that saves time and reduces stress for both clients and businesses by streamlining the process of booking, rescheduling, and canceling appointments. Key features contributing to this experience include an intuitive interface, 24/7 self-service booking, automated notifications, real-time availability, a mobile-first design, and integrated payments.
                    </p>
                </div>
                <section className="animate-fadeIn w-full py-16">
                    {/* <h1 className="text-blue-600 text-4xl m-5 border-b border-gray-200">One of The Superior and Extensive Patient Care</h1> */}
                    <div className={`${BaseContainerStyle}`} >
                        <div>
                             <h1 className={`${headingStyle}`} > One of The Superior and Extensive Patient Care</h1>
                              <p className={`${paragraphStyles}`}>Good patient care involves a comprehensive approach that considers the patient's physical, emotional, and mental well-being. It involves clear communication, building trust, and personalized treatment plans that take into account the patient's unique needs and preferences</p>
                        </div>
                        <div className={`relative w-full max-h-[600px] flex justify-center items-center`}>
                            {!imageLoaded && 
                                <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"> </div>
                            }
                            <img 
                            onLoad={() => handleImageLoading('care')}
                            src="/patientCareNew.jpg" loading="lazy" 
                            className={`${BaseImageStyling} ${!imageLoaded.care ? 'hidden' : ''}`}
                            alt="Patient Care"/>
                        </div>
                        
                    </div>
                </section>

                <section className="bg-gray-50 w-full py-16">
                   
                    <div className={`${BaseContainerStyle} md:flex-row-reverse`}>
                       
                        <div className="w-full">
                             <h1 className={`${headingStyle}`} >Renowned and highly Recommended Doctors</h1>
                             <p className={`${paragraphStyles}`}>
                                Good patient care involves a comprehensive approach that considers the patient's physical, emotional, and mental well-being. It involves clear communication, building trust, and personalized treatment plans that take into account the patient's unique needs and preferences
                             </p>
                        </div>
                         <img src="patientFacilitiesDoctors.jpg" className={`${BaseImageStyling}`} loading="lazy" />
                    </div>

                </section>
                <section className="bg-white py-16">
                    <div>
                        
                        <div className={`${BaseContainerStyle}`} >
                            <div>
                                <h2 className={`${headingStyle}`}>WorldWide Patients</h2>
                                <p className={`${paragraphStyles}`}>Good patient care involves a comprehensive approach that considers the patient's physical, emotional, and mental well-being. It involves clear communication, building trust, and personalized treatment plans that take into account the patient's unique needs and preferences</p>
                            </div>
                            <img src="./internationalPatients.jpg" className={`${BaseImageStyling}`} loading="lazy" />
                        </div>


                    </div>
                </section>
                <section className="bg-gray-50 py-16">
                        <div className={`${BaseContainerStyle} md:flex-row-reverse`} >
                            <div>
                                  <h1 className={`${headingStyle}`}>top Class Care with Counselling</h1>
                                  <p className={`${paragraphStyles}`}>Good patient care involves a comprehensive approach that considers the patient's physical, emotional, and mental well-being. It involves clear communication, building trust, and personalized treatment plans that take into account the patient's unique needs and preferences</p>
                            </div>
                            <img src="topFacilitiesCounselling.jpg" className={`${BaseImageStyling}`} loading="lazy" />
                        </div>
                </section>
            </div>
        </div>
    )

}

export default TopFacilities

// https://share.google/aimode/rb3zADzj0eyszOO6q

