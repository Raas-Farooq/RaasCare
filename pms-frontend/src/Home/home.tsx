
import { useEffect, useRef } from "react";

import Navbar from '../Components/Navbar/navbar.tsx';
import { ArrowRight } from "lucide-react";
import { footerLinks, servicesImages, myIcons, termsAndConditions, doctorsSpecialities } from './homeData.tsx';
import { useNavigate } from "react-router-dom";
import useImageCached from "./useImageCached.tsx";
import HeroVideo from "./heroVideo.tsx";
import Banner from "./banner.tsx";
import DemoCredentials from "./demoCredentials.tsx";
import axios from "axios";


function Home() {
  const navigate = useNavigate();
  const contactRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const { imageLoaded } = useImageCached("/relief.webp");
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    console.log("backend URL ",backend_url)
    localStorage.removeItem('doctorId');
    async function detectSlotsDuplication() {
      const fetchSlots = await axios.get(`${backend_url}/pms/getDoctorSlots/693ce46789386e011f48a7db`);
      if (fetchSlots.data.success) {
        console.log("doctor slots ", fetchSlots.data);
        // let count = 0;
        // const date = new Date(2025, 11, 19);
        // const formatDate = date.toISOString().split('T')[0];
        // console.log("formated Date ", formatDate);
        // const mySlots = fetchSlots.data.updatedSlots;
        // const specificDate = mySlots.filter(slot => {
        //   const currentDate = new Date();
        //   const slotDateObject = new Date(slot.slotDate.startDate);

        //   // Return the boolean result of the comparison directly
        //   return slotDateObject < currentDate;
        // });
        // console.log("old Slots ", specificDate);
        // const today = new Date().toISOString().split('T')[0]
        // for(let i = 0; i < 5; i++){
        //     console.log("slotday ", specificDate[i].slotDay, " type: ", typeof(specificDate[i].slotDay));
        //     console.log("today  ",today , " typeof ", typeof(today));
        //     if(specificDate[i].slotDay < today){
        //       console.log("YES less than")
        //     }
        // }
        // const allTimes = mySlots.map((slot:any) => (
        //   slot.slotTime
        // ))
        // for (const slot of mySlots){
        //   if (slot.slotDay && slot.slotKey){
        //     count++;
        //   }
        // }
        // console.log("total num of slots which contains slotDay and slot.slotKey ", count, "one slot ", mySlots[22])
      } else {
        console.log("not able to fetch the slots: respone ", fetchSlots);
      }
    }
    detectSlotsDuplication();
  }, [])

  const handleSpecialityClick = (targetSpeciality: string) => {

    navigate('/doctorsBySpeciality', { state: { targetField: targetSpeciality } })
  }


  const handleServicesClick = (service: { title: string }) => {
    if (service.title === 'Nursing Care') {
      navigate('/nursingCare');
    }
    else if (service.title === 'Diagnostic Center') {
      navigate('/diagnosticCenter');
    }
    else if (service.title === 'Our Doctors') {
      navigate('/ourDoctors');
    }
  }



  return (
    <>
      <section className="Hero-Section relative bg-gradient-to-r from-purple-50 to-white">
        <Navbar servicesRef={servicesRef} contactRef={contactRef} />
        <Banner />
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-4 py-8">
          <h1 className="text-4xl md:text-5xl mt-5 font-bold text-yellow-600">
            Your health our priority
          </h1>
          <h1>All the Praises Belongs to Almighty (SWT). Indeed with Sonner</h1>
          <HeroVideo />
          <DemoCredentials />
          <h1 className="text-3xl sm:text-4xl md:text-5xl mt-5 font-bold text-gray-800">
            Book your Appointment
          </h1>
          <p className="text-lg mt-4 text-gray-600">
            Book appointments with trusted healthcare professionals in just few clicks
          </p>
          <div className="mt-6 flex justify-center gap-5">
            <button onClick={function () { navigate('/MakeAppointment') }}
              className="text-white text-sm sm:text-base px-4 py-2 md:px-6 md:py-4 rounded-full bg-purple-500 hover:bg-purple-600 transition">
              Book Appointment
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:text-purple-700 hover:border-purple-600 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>
      <section className="Achievements-Section relative bg-gradient-to-r from-purple-50 to-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-5">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl mt-5 font-bold text-gray-800">
                Treatment & Relief starts here
              </h1>
              <p className="text-md mt-4 text-gray-600">
                All the healthcare services in just one place.
                Team of Best Professionals committed to provide the best Care.
              </p>
              <div className="flex flex-col gap-4">
                <p className="mt-4 text-gray-600">Why You must come Here first</p>
                <button
                  onClick={() => navigate('/topFacilities')}
                  className="block px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:text-purple-700 hover:border-purple-600 transition">
                  Learn More
                </button>
              </div>

            </div>
            <div className="w-full flex justify-center items-center mt-4">

              {imageLoaded === 'loading' &&
                <div className="w-full max-w-md sm:aspect-[3/2] px-4 py-6 bg-gray-200 animate-impulse rounded-lg">

                </div>
              }

              <img
                className={`${imageLoaded === "loaded"
                  ? "w-full max-w-md sm:aspect-[3/2] rounded-2xl shadow-lg shadow-transition object-cover hover:scale-105 duration-300" : "hidden"}`}
                loading="lazy"
                src="/relief.webp"
                alt={"Treatment & Relief"}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="DoctorsBySpeciality-Section relative bg-gradient-to-r from-purple-50 to-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-6 py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl mt-5 font-bold text-gray-800">
              Browse Doctors By Speciality
            </h1>
            <p className="text-md mt-4 text-gray-600">
              the team of best doctors serving with passion for the cure of humanity.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 items-center gap-5 mt-6">
              {doctorsSpecialities.map((doctors, ind) => (
                <button key={ind}
                  onClick={() => handleSpecialityClick(doctors.speciality)}
                  className="flex flex-col items-center justify-center cursor-pointer 
                bg-white shadow-md px-5 py-6 min-h-[150px] transition-all
                duration-300 rounded-2xl border-transparent hover:shadow-xl
                 hover:scale-[1.02] hover:border-purple-400 hover:shadow-purple-100">

                  <span className="p-2 bg-purple-50 rounded-full hover:bg-purple-100">
                    {doctors.logo}
                  </span>
                  <h2 className="font-medium text-center text-sm md:text-base my-5 ">{doctors.speciality}</h2>
                  {/* <div className="flex gap-2">
                    <p className="text-xs text-gray-500 mt-1">{doctors.strength}</p>
                    <Users size={16} className="text-purple-400 mt-0.5" />
                  </div> */}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>
      <section ref={servicesRef} className="Services-Section bg-gradient-to-br from-purple-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Care Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              End-to-end healthcare solutions from home visits to advanced diagnostics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center ">
            {servicesImages.map((service, index) => (
              <div key={index} className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-md
                ${servicesImages.length % 2 !== 0 && index === servicesImages.length - 1 ? 'md:col-span-2 md:flex md:justify-center lg:col-span-1' : ''}`}
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={service.path}
                    alt={service.alt}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 z-20">
                  <button className="w-full py-3 px-6 bg-white text-purple-700 font-medium rounded-full 
                         hover:bg-purple-50 transition-all duration-300 
                         translate-y-2 group-hover:translate-y-0 
                         opacity-0 group-hover:opacity-100 flex items-center justify-center"
                    onClick={() => handleServicesClick(service)}
                  >
                    {service.title}
                    <ArrowRight className="text-blue-500 inline ml-2 h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white 
                pb-24 group-hover:pb-32 transition-all duration-300 z-10">
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="text-sm opacity-90">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
      <footer className="Footer relative bg-gradient-to-r from-purple-50 to-white border-t border-gray-200 mt-16">
        <div className="bg-gray-50 flex justify-center items-center py-12">
          <div className="flex gap-4 md:gap-6 flex-wrap justify-center px-4">
            {myIcons.map((icon, ind) => (
              <button className="rounded-full" key={ind} aria-label={`Follow us on ${icon.type}`}>
                {icon.logo}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border-b border-gray-200 pb-8 gap-8">
            {
              footerLinks.map((links, index) => (
                <div className="flex flex-col" key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 uppercase mb-4 tracking-wide">
                    {links.name}
                  </h3>
                  <div className="flex flex-col">
                    {links.data.map((link, ind) => {
                      return (
                        <a
                          key={ind}
                          href="#"
                          className="text-sm text-left text-gray-600 hover:text-purple-700 mb-3">
                          {link}
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))
            }
          </div>
          {/* grid grid-rows-4 md:grid-rows-2 grid-flow-col */}
          <div className="pt-8 pb-6" ref={contactRef} >
            <div className="flex flex-wrap justify-center items-center gap-4 my-3 text-xs text-gray-500 mb-3">
              {termsAndConditions.map((term, ind) => {
                return (
                  // <div className="flex justify-center items-center ">
                  <a
                    key={ind}
                    href="#"
                    className="flex hover:text-purple-700 text-xs">
                    {term}
                  </a>

                )
              })}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">+92 301 2707036, 042 9375214, 042 5423214 | medicare@gmail.com</p>
              <p className="text-sm text-gray-600">Lahore 42000 | &copy; 2025 MediCare for Public, Medical Education and Research. All Rights Reserved</p>
            </div>
          </div>
        </div>
      </footer>
      {/* <ScrollRestoration /> */}
    </>

  )
}

export default Home

// aga@gmail.com aga@3344
// raas@gmail.com raas$0022
// Attend 1 Lahore meetup (GDG, Colabs, Daftarkhwan, kickstart, the hive etc.).
// LinkedIn Events Search:


// Search “Lahore developer meetup” or “React Lahore” — filter by Events.

// bash
// git checkout main
// git pull origin main
// Use code with caution.

// Create your feature branch. Create and switch to a new branch for your task.
// bash
// git checkout -b feature/patientProfile
// Use code with caution.

// Work and commit locally. Make your changes, add and commit them. Continue to do this as you make progress on the feature.
// bash
// git add .
// git commit -m "feat: Add patient profile interface"
// Use code with caution.

// Push your feature branch. When you are ready to share your work or are finished with the feature, push your branch to the remote repository.
// bash
// git push -u origin feature/patientProfile
// Search “Lahore developer meetup” or “React Lahore” — filter by Events.

