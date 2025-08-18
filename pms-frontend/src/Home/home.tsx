
import { useEffect } from "react";
import { useAuth } from "../context/appContext";
import Navbar from '../Components/Navbar/navbar.tsx';
import HeroImage from "./heroImage.tsx";
import { Baby, HeartPulse, SkullIcon, Stethoscope } from "lucide-react";

function Home() {
  const { userRole } = useAuth();
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    console.log("this i sthe userRole ", userRole);
  }, [])

  return (
    <>
      <section className="Hero-Section relative bg-gradient-to-r from-purple-50 to-white">
        {!userRole &&
          <Navbar />
        }
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-4 py-8">
          <h1 className="text-4xl md:text-5xl mt-5 font-bold text-yellow-600">
            Your health our priority
          </h1>
          <HeroImage />
          <h1 className="text-4xl md:text-5xl mt-5 font-bold text-gray-800">
            Find the Best Doctors
          </h1>
          <p className="text-lg mt-4 text-gray-600">
            Book appointments with trusted healthcare professionals in just few clicks
          </p>
          <div className="mt-6 flex justify-center gap-5">
            <button className="text-white px-4 py-2 md:px-6 md:py-3 rounded-full bg-purple-500 hover:bg-purple-600 transition">
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
              <h1 className="text-4xl md:text-5xl mt-5 font-bold text-gray-800">
                Treatment & Relief starts here
              </h1>
              <p className="text-md mt-4 text-gray-600">
                All the healthcare services in just one place.
                Team of Best Professionals committed to provide the best Care.
              </p>
              <div className="flex flex-col gap-4">
                <p className="mt-4 text-gray-600">Why You must come Here first</p>
                <button className="block px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:text-purple-700 hover:border-purple-600 transition">
                  Learn More
                </button>
              </div>

            </div>
            <div className="mt-4">
              <img className="w-full max-w-xs max-w-sm md:max-w-sm lg:max-w-md rounded-2xl shadow-lg shadow-transition object-cover hover:scale-105 duration-300" src="/relief.jpg" alt={"Treatment & Relief"} />
            </div>
          </div>
        </div>
      </section>
      <section className="DoctorsBySpeciality-Section relative bg-gradient-to-r from-purple-50 to-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-5">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl md:text-5xl mt-5 font-bold text-gray-800">
                Find Any Doctor Here
              </h1>
              <p className="text-md mt-4 text-gray-600">
                All the healthcare services in just one place.
                Team of Best Professionals committed to provide the best Care.
              </p>
              <div className="flex flex-col gap-4">
                <Stethoscope className="text-purple-800" size={30} />

                <HeartPulse />
                <SkullIcon />
                <Baby />
                <p className="mt-4 text-gray-600">Why You must come Here first</p>
                <button className="block px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:text-purple-700 hover:border-purple-600 transition">
                  Learn More
                </button>
              </div>

            </div>
            <div className="mt-4">
              <img className="w-full max-w-xs max-w-sm md:max-w-sm lg:max-w-md rounded-2xl shadow-lg shadow-transition object-cover hover:scale-105 duration-300" src="/relief.jpg" alt={"Treatment & Relief"} />
            </div>
          </div>
        </div>
      </section>
      <section className="Services-Section relative bg-gradient-to-r from-purple-50 to-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-4 py-12">
          <h1 className="text-4xl md:text-5xl mt-5 font-bold text-gray-800">
            Other Services
          </h1>
          <p className="text-lg mt-4 text-gray-600">
            You will find all services from home to caring center.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-3">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:text-purple-700 hover:border-purple-600 transition">
                Doctors
              </button>
              <img src="/youngDoctor.jpg" alt={'Find Doctor Picture'} className="max-w-sm max-h-[500px] rounded-2xl object-cover object-top shadow-md hover:scale-110 transition duration-500 cursor-pointer" />
            </div>
            <div className="flex flex-col gap-3">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:text-purple-700 hover:border-purple-600 transition">
                Nursing Care
              </button>
              <img src="/nursingCare.jpg" alt={'Nursing Care Unit'} className="max-w-sm max-h-[300px] rounded-2xl object-cover shadow-md hover:scale-110 transition duration-500 cursor-pointer" />
            </div>
            <div className="flex flex-col gap-3">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:text-purple-700 hover:border-purple-600 transition">
                Diagnostic Center
              </button>
              <img src="/testing.jpg" alt={'Find Doctor Picture'} className="max-w-sm max-h-[300px] rounded-2xl object-cover shadow-md hover:scale-110 transition duration-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </section>
      <footer className="Footer relative bg-gradient-to-r from-purple-50 to-white border-t border-gray-200 ">
        <div className="bg-blue-500 h-36">

        </div>
        <div className="bg-purple-400 text-white max-w-7xl mx-auto flex flex-col items-center text-center px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-5 justify-center text-center">

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800">
                  Professionals
                </h3>
                <div className="flex flex-col">
                  <button className="hover:text-gray-700 hover:underline transition duration-300"> Physicians </button> 
                  <button className="hover:text-gray-700 hover:underline transition duration-300"> Surgeons </button> 
                  <button className="hover:text-gray-700 hover:underline transition duration-300"> Cardialogist </button> 
                  <button className="hover:text-gray-700 hover:underline transition duration-300"> Gynacologists </button> 
                  <button className="hover:text-gray-700 hover:underline transition duration-300"> Dentists </button> 
                  <button className="hover:text-gray-700 hover:underline transition duration-300"> Dermatologists </button> 
                  <button className="hover:text-gray-700 hover:underline transition duration-300">Gastroenterologist </button> 
                  <button className="hover:text-gray-700 hover:underline transition duration-300"> Psychologists </button> 
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800">
                  Departments
                </h3>
                <ul>
                  <li> Surgical Department</li>
                  <li> Cardic Center</li>
                  <li>Cancer Care</li>
                  <li> Gyny Facilities</li>
                  <li>Dental Research Search</li>
                  <li>Skin Care</li>
                  <li> Mental Health Center</li>
                </ul>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800">
                  About
                </h3>
                <ul>
                  <li> About Us</li>
                  <li> Contact</li>
                  <li> Locations</li>
                  <li> Help Center</li>
                  <li> Our Research Center</li>
                  <li> About Rehabilation </li>
                  <li> More Services</li>
                </ul>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800">
                  Blogs, News
                </h3>
                <ul>
                  <li> Daily News</li>
                  <li> Daily Blog</li>
                  <li> Weekly Doctors Blog</li>
                  <li> Blog on Research</li>
                  <li> Patients Reviews</li>
                  <li> Recognition & Awards </li>
                </ul>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800">
                  More 
                </h3>
                <ul>
                  <li> Career</li>
                  <li> Education and Training</li>
                  <li> Research Activities</li>
                  <li> Home Services</li>
                  <li> Patients Reviews</li>
                  <li> Recognition & Awards </li>
                </ul>
              </div>
            </div>
          
          </div>
      </footer>
    </>

  )
}

export default Home

// aga@gmail.com aga@3344
// raas@gmail.com raas$0022

//has to ask about usage of curly braces with Route:- when using with object we don't use {} with 'element' but why use when then when Route is not sorrounded by object?