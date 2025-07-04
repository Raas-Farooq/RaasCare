import { useEffect, useState } from "react"
import { FaBars, FaTimes } from "react-icons/fa"
import useWindowSize from "./windowSize";
import { useNavigate } from "react-router-dom";



const Navbar = () => {
    const [isShowMenu, setIsShowMenu] = useState(false);
    const {width} = useWindowSize();
    const navigate = useNavigate();
    function handleMenuClick(){
            setIsShowMenu(!isShowMenu);
    }
    // useEffect (() => {
    //     function thirdMax(arr: number[]): number {
    //     const yourArr = [2, 12,0,-3,10, -1];
    //     yourArr.forEach((num,i) => {
    //         yourArr[i]= num * num;
    //     })
    //     yourArr.sort((a,b) => a-b);
    //     console.log("yourArray has been Sorted ", yourArr);
    //     }
    //     const arr = [3, 1,3];
    //     thirdMax(arr)
    // })
    

    useEffect(() => {
        console.log("width: ", width);
        if(width>1024){
            setIsShowMenu(false);
        }
    },[width])

   function handleRegister(){

    navigate('/register')
   }


    return (
        <div className={`flex items-center flex-wrap justify-between relative ${isShowMenu ? 'lg:h-auto': ''}`}>
            <header className="font-bold text-3xl ">
                MediCare
            </header>
            <div>
                <button 
                onClick={handleMenuClick} 
                aria-label="toggle Menu"
                aria-expanded={isShowMenu}
                className="text-3xl lg:hidden ml-auto transition: all 0.3s ease-in-out">
                
                    {isShowMenu ? <FaTimes /> : <FaBars /> } 
                    </button>
            </div>
            <nav className={`w-full lg:w-auto ${isShowMenu ? 'block absolute top-full left-0 bg-white shadow-lg z-50 p-4' : 'hidden lg:block'}`}
            aria-labelledby="main-navigation" >
                <ul className={`flex flex-col lg:flex-row gap-6 ${isShowMenu ? 'py-4' : ''}`}>
                    {['Services', 'Book Appointment', 'Awards', 'Contact', 'About'].map((tab, ind) => (
                         <li key={ind}><a href="#" className="hover:text-purple-600 hover:scale-105 transition-transform block focus:outline-none focus:bg-purple-400 focus:rounded-md text-lg"> {tab} </a></li>
                    ))}
                </ul>
            </nav>
            <div className={`w-full lg:w-auto ${isShowMenu ? 'block bg-white pb-4 px-4' : 'hidden lg:flex'} gap-4`}>
                <button className="text-lg hover:scale-110 transition-transform block w-full lg:w-auto text-left lg:text-center px-4 py-2 hover:text-purple-600">
            LogIn
        </button>
        <button 
        onClick={handleRegister}
        className="border border-gray-700 bg-purple-400 rounded-full shadow-xl px-6 py-2 hover:bg-purple-500 transition-colors w-full lg:w-auto text-center">
            Get Started
        </button>
            </div>
        </div>
    )
}

export default Navbar