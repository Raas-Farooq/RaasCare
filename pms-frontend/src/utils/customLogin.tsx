
import toast from 'react-hot-toast';


// Function to call when user confirms
const useCustomLogin = () => {

 
    const showConfirmDialogue = () => {

        return new Promise(resolve => {
            toast((t) => (
                <div className="flex flex-col items-center">
                    <span>Please log in to confirm your appointment.</span>
                    <div className="mt-4">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                resolve(true)
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:!bg-red-600 "
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                resolve(false);
                                }
                            }
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:!bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ), {
                //  toast behavior
                duration: Infinity, 
            });
        })
    }

    return showConfirmDialogue
};

export default useCustomLogin