import { useEffect, useState, type FC, type RefObject } from "react"
import { FaBars, FaTimes } from "react-icons/fa"
import useWindowSize from "./windowSize";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/appContext";
import { Heart, User } from "lucide-react";


interface NavbarProps { 
    servicesRef:React.RefObject<HTMLElement | null>;
    contactRef: React.RefObject<HTMLDivElement | null>;
}

const Navbar = ({servicesRef, contactRef}: NavbarProps) => {
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

    useEffect(() => {

        console.log("isPatienCatd: ", isPatientCard);
    }, [isPatientCard])

    useEffect(() => {
        // if(servicesRef.current){
        //     console.log(" services ref ", servicesRef.current)
        // }
        
    },[]);

    const handleServiceClick = () => {
        if(servicesRef.current){
            console.log(" services ref ", servicesRef.current);
            servicesRef.current.scrollIntoView({
                behavior:'smooth',
                block:'start'
            })
        }
        
    }
    
    const handleContactClick = () => {
        console.log(" contact ref siple ", contactRef);
        if(contactRef.current){
            console.log(" services ref ", contactRef.current);
            contactRef.current.scrollIntoView({
                behavior:'smooth',
                block:'start'
            })
        }
        
    }
    function handleRegister() {

        navigate('/register')
    }
    const handleMyAppointments = () => {
        console.log("my Appointments;  run");
        setIsShowMenu(false);
        navigate('/patient-dashboard/myAppointments')
    }
    function handleLogout() {
        const confirm = window.confirm("Are You Surely Want to Logout");
        if (confirm) {
            logout();
        };
    }

    function handleLogin() {
        navigate('/login');
    }
    function handleUserClick() {
        console.log("handle user clicked: ")
        const message = window.confirm('You have clicked the user Menu. Are you sure to Change Yourself');
        if(message){
            window.alert("Be alert. Now you will change Every aspect of your life");
        }else{
             window.alert("Okay you can Take more time if you have?");
        }
    }
    const navbarLinks = [
        { name: 'Services', onclick:handleServiceClick },
        { name: 'Book Appointment', href: '/allDoctorsPublic' },
        { name: 'Contact', onclick:handleContactClick },
        { name: 'About', href: "#" },
    ]
    const buttonBase =
        "px-6 py-2 rounded-full shadow-md transition-all duration-300"

    return (
        <div className={`sticky top-0 z-10 flex items-center flex-wrap bg-gradient-to-r from-white to-purple-50 justify-between bg-white shadow-sm px-2 py-4 relative ${isShowMenu ? 'lg:h-auto' : ''}`}>
            <div className="flex gap-3">
                <header className="text-2xl md:text-3xl text-purple-800 font-semibold ">
                    RaasCare
                </header>
                <Heart className="text-red-500" size={30} />
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
                            </NavLink>:
                             
                             <button onClick={tab.onclick} className={
                                `inline-block relative text-lg font-thin text-gray-700 transition-all 
                                after:block after:h-[2px] after:w-0 after:bg-purple-500 
                                after:transition-all hover:after:w-full hover:text-purple-600 
                               `}
                               >
                                {tab.name}
                            </button>
                            }
                            
                        </li>
                    ))}
                </ul>
            </nav>
            <div className={`w-full lg:w-auto ${isShowMenu ? 'block bg-white p-4' : 'hidden lg:flex'} gap-5`}>
                {userRole && userRole === 'patient' &&
                    <div>
                        <button className={`${isShowMenu && 'hidden'}`}  onClick={() => setIsPatientCard(!isPatientCard)} > {isPatientCard ? <FaTimes /> : <User /> } </button>
                        <div className={`${isShowMenu || isPatientCard ? 'flex flex-col' : 'hidden'} `}>
                            <button className="font-normal" onClick={handleMyAppointments}>My Appointments</button>
                            <button>Profile</button>
                            <button onClick={handleLogout} >logout</button>
                        </div>
                    </div>

                }
                {userRole && userRole !== 'patient' &&
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

export default Navbar