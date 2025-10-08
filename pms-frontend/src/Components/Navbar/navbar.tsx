import React, { memo, useEffect, useState, type FC, type RefObject } from "react"
import { FaBars, FaTimes } from "react-icons/fa"
import useWindowSize from "./windowSize";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/appContext";
import { Heart, User } from "lucide-react";
import toast from "react-hot-toast";



interface NavbarProps {
    servicesRef: React.RefObject<HTMLElement | null>;
    contactRef: React.RefObject<HTMLDivElement | null>;
}

const Navbar = ({ servicesRef, contactRef }: NavbarProps) => {
    const [isShowMenu, setIsShowMenu] = useState(false);
    const [isPatientCard, setIsPatientCard] = useState(false);
    const { userRole, logout } = useAuth();
    const { width } = useWindowSize();
    const navigate = useNavigate();
    function handleMenuClick() {
        setIsShowMenu(!isShowMenu);
    }

    useEffect(() => {

        if (width > 1024) {
            setIsShowMenu(false);
        }
    }, [width])


    

    const handleServiceClick = () => {
        if (servicesRef.current) {
            servicesRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }

    }

    const handleContactClick = () => {

        if (contactRef.current) {
            contactRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }

    }

    const handleProfileClick = () => {
        navigate('/patient-dashboard/patientProfile');
    }

    function handleRegister() {

        navigate('/register')
    }
    const handleMyAppointments = () => {
        console.log("my Appointments;  run");
        setIsShowMenu(false);
        navigate('/patient-dashboard/myAppointments')
    }
    const onLogout = () => {
        logout()
    }
    function handleLogout() {
        toast((t) => (
      <div className="flex items-center gap-3">
        <span>Are you sure you want to logout?</span>
        <button
          onClick={() => {
            toast.dismiss(t.id); // close toast
            onLogout();          // your logout function
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm"
        >
          No
        </button>
      </div>
    ), {
      duration: 4000, // auto-dismiss after 4s if no action
    });
        // new Promise((resolve, reject) => {
        //     // Show a toast with action buttons.
        //     toast(t => (
        //         <span>
        //             Are you sure you want to **logout**?
        //             <div style={{ marginTop: '10px' }}>
        //                 <button
        //                     onClick={() => {
        //                         resolve();   
        //                         toast.dismiss(t.id); // Dismiss the toast
        //                     }}
        //                     style={{ marginRight: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
        //                 >
        //                     Logout
        //                 </button>
        //                 <button
        //                     onClick={() => {
        //                         reject();
        //                         toast.dismiss(t.id); // Dismiss the toast
        //                     }}
        //                     style={{ backgroundColor: 'lightgray', border: 'none', cursor: 'pointer' }}
        //                 >
        //                     Cancel
        //                 </button>
        //             </div>
        //         </span>
        //     ), {
        //         duration: Infinity, // Keep the toast until the user acts
        //     });
        // })
        //     .then(() => {
        //         // Run the logout function after the user confirms
        //         logout();
        //         toast.success("You have been logged out.");
        //     })
        //     .catch(() => {
        //         // Handle cancellation
        //         toast.error("Logout cancelled.");
        //     });
    };


function handleLogin() {
    navigate('/login');
}
function handleUserClick() {
    console.log("handle user clicked: ")
    const message = window.confirm('You have clicked the user Menu. Are you sure to Change Yourself');
    if (message) {
        window.alert("Be alert. Now you will change Every aspect of your life");
    } else {
        window.alert("Okay you can Take more time if you have?");
    }
}

const navbarLinks = [
    { name: 'Services', onclick: handleServiceClick },
    { name: 'Book Appointment', href: '/allDoctorsPublic' },
    { name: 'Contact', onclick: handleContactClick },
    { name: 'About', href: "#" },
]
const buttonBase = "px-6 py-2 rounded-full shadow-md transition-all duration-300"
const underlineEffect = 'font-thin transition-all after:block after:h-[2px] after:w-0 after:bg-purple-500 after:transition-all hover:after:w-full hover:text-purple-600';


return (
    <div className={`sticky top-0 z-10 flex items-center flex-wrap bg-gradient-to-r from-white to-purple-50 justify-between bg-white shadow-sm px-2 py-4 relative ${isShowMenu ? 'lg:h-auto' : ''}`}>
        <div className="flex gap-3">
            <header 
            className="text-2xl md:text-3xl text-purple-800 font-semibold ">
                RaasCare
            </header>
            <Heart className="text-red-500" size={30} />
            {userRole && (userRole === 'doctor' || userRole === 'admin') &&
                <div className="mt-1">
                    <span className="px-3 py-1 text-xs font-medium bg-red-100 text-blue-800 rounded-full">
                        {userRole}
                    </span>
                    <button
                        onClick={() => navigate(`${userRole}-dashboard`)}
                        className={`font-normal ml-3 text-purple-500 hover:bg-purple-100`}>
                        Dashboard
                    </button>
                </div>
            }
        </div>
        
        <div>
            <button
                onClick={handleMenuClick}
                aria-label="Toggle Menu"
                aria-expanded={isShowMenu}
                className="text-3xl lg:hidden ml-auto">

                {isShowMenu ? <FaTimes /> : <FaBars />}
            </button>
        </div>
        <nav className={`w-full lg:w-auto ${isShowMenu ? 'block absolute top-full left-0 bg-white shadow-lg z-50 p-4' : 'hidden lg:block'}`}
            aria-labelledby="Main-Navigation" >
            <ul className={`flex flex-col lg:flex-row gap-6 ${isShowMenu ? 'py-4' : ''}`}>
                {navbarLinks.map((tab, ind) => (
                    <li key={ind} >
                        {
                            tab.href ?
                                <NavLink to={tab.href} className={({ isActive }) =>
                                    `inline-block relative text-lg font-normal text-gray-700 transition-all 
                                after:block after:h-[2px] after:w-0 after:bg-purple-500 
                                after:transition-all hover:after:w-full hover:text-purple-600 
                                ${isActive ? "font-thin text-gray-900" : "font-thin"}`
                                }>
                                    {tab.name}
                                </NavLink> :

                                <button onClick={tab.onclick} className={
                                    `inline-block relative text-lg font-thin text-gray-700 ${underlineEffect}
                               `}
                                >
                                    {tab.name}
                                </button>
                        }

                    </li>
                ))}
            </ul>
        </nav>
        <div className={`relative w-full lg:w-auto ${isShowMenu ? 'block bg-white p-4' : 'hidden lg:flex'} gap-5`}>
            {userRole && userRole === 'patient' &&
                <>
                    <button className={`mr-10 text-center hover:text-blue-500 text-lg transition-colors duration-200 ${isShowMenu && 'hidden'}`} onClick={() => setIsPatientCard(!isPatientCard)} > {isPatientCard ? <FaTimes /> : <User />} </button>
                     <div className={`flex flex-col text-black z-15 
                        ${isShowMenu ? 'relative flex-start items-start mr:auto transition-all duration-300 ease-out'
                            : 
                        'absolute top-10 right-1 bg-white '}`}>
                        <div className={`${isShowMenu || isPatientCard ? 'transition-all duration-200 ease-in-out transform origin-top-right scale-100 flex flex-col' : 'shadow-none hidden'} ${isPatientCard && !isShowMenu && 'shadow-lg w-40 p-5 space-y-3'} `}>
                            <button onClick={handleProfileClick} className={`${underlineEffect}`}>Profile</button>
                            <button className={`${underlineEffect}`} onClick={handleLogout}>logout</button>
                            <button className={`${underlineEffect}`} onClick={handleMyAppointments}>My Bookings</button>
                        </div>
                    </div>

                </>
            }
            {userRole && (userRole === 'doctor' || userRole === 'admin') &&
                <button
                    onClick={handleLogout}
                    className={`${buttonBase} font-semibold bg-purple-500 text-white hover:bg-purple-600`}>
                    Logout
                </button>
            }

            {!userRole &&
                <>
                    <button
                        onClick={handleLogin}
                        className={` ${buttonBase} hover:scale-105 font-medium text-gray-700 hover:text-purple-600 ${isShowMenu && 'mr-3 '}`}>
                        LogIn
                    </button>
                    <button
                        onClick={handleRegister}
                        className={`${buttonBase} font-semibold bg-purple-500 text-white hover:bg-purple-600`}>
                        Get Started
                    </button>
                </>}

        </div>
    </div>
)
}

export default memo(Navbar)