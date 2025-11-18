import { Heart } from "lucide-react"
import { useAuth } from "../../context/appContext";
import useCustomLogout from "../../utils/customLogout.tsx";


 const confirmLogout = useCustomLogout();


const DoctorNavbar = () => {


    const { logout } = useAuth();

    const handleLogoutClick = async () => {
    const userResponse = await confirmLogout();

    if(userResponse){
        logout();
    }

    }
    


    return (
        <div className="w-full z-10 flex justify-between items-center p-4 bg-white shadow-sm ">
            <div className="flex items-center gap-4">
                <div className="flex items-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-purple-700">
                        RaasCare
                    </h1>
                    <span className="text-2xl ml-2 text-red-500"> {<Heart />} </span>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-red-100 text-blue-800 rounded-full">
                    Doctor
                </span>
            </div>

            <div className="text-right m-2">
                <button onClick={handleLogoutClick}
                    className="border border-gray-200 px-4 py-2 shadow-lg 
                    text-gray-800 bg-red-400 hover:text-white hover:bg-red-600 
                    rounded-lg hover:border-red-600 transition-colors duration-500"
                >Log out
                </button>
            </div>
        </div>
    )
}

export default DoctorNavbar

