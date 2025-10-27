import { Heart } from "lucide-react"
import { useAuth } from "../../context/appContext";
import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const DoctorNavbar = () => {

    const { logout } = useAuth();

    const handleLogoutClick = async () => {
        alert("Logout Clicked! ");
        async function loggingOut() {
            const response = await axios.get(`${backend_url}/pms/logout`, {
                withCredentials: true
            });
            if (response.data.success) {
                logout();
            }

            localStorage.removeItem(`storedTab`);
            
        }

        loggingOut()
    }


    return (
        <div className="w-full z-10 flex justify-between items-center p-4 bg-white shadow-sm ">
            <div className="flex items-center gap-4">
                <div className="flex items-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        MediCare
                    </h1>
                    <span className="text-2xl ml-2 text-red-500"> {<Heart />} </span>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-red-100 text-blue-800 rounded-full">
                    Doctor
                </span>
            </div>

            <div className="text-right m-2">
                <button onClick={handleLogoutClick}
                    className="border border-red-200 px-4 py-2 shadow-md font-medium text-red-500 hover:text-white hover:bg-red-600 rounded-full hover:border-red-600 transition-transform transition-colors duration-200"
                >Logout
                </button>
            </div>
        </div>
    )
}

export default DoctorNavbar