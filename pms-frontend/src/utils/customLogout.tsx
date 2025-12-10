import {toast} from "sonner"


const useCustomLogout = () => {


    function confirmLogout() {
        return new Promise((resolve) => {
            toast.custom((id) => (
                <div className="flex items-center gap-3 text-sm pointer-events-auto p-4 bg-white rounded-lg shadow-lg min-w-[300px]">
                    <span className="flex-1">Are you sure you want to logout?</span>
                    <button
                        onClick={() => {
                            toast.dismiss(id); // close toast
                            resolve(true);          // your logout function
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm whitespace-nowrap"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss(id)}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded text-sm whitespace-nowrap"
                    >
                        No
                    </button>
                </div>
            ), {
                duration: Infinity
            });
        });
    }

    return confirmLogout
}

export default useCustomLogout;
