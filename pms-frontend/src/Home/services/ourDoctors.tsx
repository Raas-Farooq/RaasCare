import Navbar from "../../Components/Navbar/navbar"




const OurDoctors = () => {


    const headingStyle = "text-xl m-5 px-2 border-b w-full object-contain border-gray-300";
    const BaseImageStyling = "w-full h-full object-contain sm:w-full md:w-full rounded-lg shadow-md shadow-transition hover:scale-105 transition-all duration-700";
    const BaseContainerStyle = 'flex flex-col md:flex-row items-center gap-6 px-4';
    const paragraphStyles = "max-w-xl mx-auto md:mx-0 tracking-tight leading-relaxed text-center";

    return (
        <div className="relative bg-gray-50 font-sans text-gray-800">
            <Navbar />
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-purple-600 text-4xl sm:text-5xl font-bold tracking-tight my-4">Team Of Top Professionals</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                       Committed to developing and improving standards in medical practice. Proven ability to assess and investigate patient symptoms, making decisions on the most appropriate treatment. Trustworthy and empathetic, delivering the highest standard of patient care at all times.
                    </p>
                </div>

                <section className="animate-fadeIn py-16">
                    <div className={`${BaseContainerStyle} flex-col-reverse md:flex-row`} >
                        <div className="md:w-1/2 flex flex-col justify-center">
                            <h2 className={`${headingStyle} text-3xl md:text-4xl text-blue-600`}>The Expertise You Need</h2>
                            <p className={`${paragraphStyles} md:text-left`}>The Professional team of our Doctors significantly improves patient outcomes by reducing medical errors, increasing efficiency, and creating a supportive environment for both patients and staff. For patients, the benefit is not just in the medical treatment itself, but in the peace of mind that comes from being cared for by a coordinated, empathetic, and highly skilled group of professionals.</p>
                        </div>
                        <div className={`relative w-full md:w-1/2 max-h-[600px] flex justify-center items-center`}>
                            <img
                                src="/bestDoctors.jpg"
                                loading="lazy"
                                className={`${BaseImageStyling} max-w-md w-full`}
                                alt="Patient Care" />
                        </div>
                    </div>
                </section>
            </div>
        </div>

    )

}

export default OurDoctors