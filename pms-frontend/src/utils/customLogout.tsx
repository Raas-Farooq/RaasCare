import toast from "react-hot-toast"

const useCustomLogout = () => {


    function confirmLogout() {
        return new Promise((resolve) => {
            toast((t) => (
                <div className="flex items-center gap-3">
                    <span>Are you sure you want to logout?</span>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id); // close toast
                            resolve(true);          // your logout function
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
                duration: Infinity
            });
        });
    }

    return confirmLogout
}

export default useCustomLogout;
