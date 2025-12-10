
import {toast} from 'sonner';


// Function to call when user confirms
const useCustomLogin = () => {

 
    const showConfirmDialogue = () => {

        return new Promise(resolve => {
            toast.custom((id) => (
                <div className="flex flex-col items-center text-sm shadow-lg rounded-lg bg-white p-3 min-w-[300px] ">
                    <span className='flex-1'>Please log in to confirm your appointment.</span>
                    <div className="mt-4">
                        <button
                            onClick={() => {
                                toast.dismiss(id);
                                resolve(true)
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:!bg-red-600 "
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss(id);
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
                duration: Infinity, 
            });
        })
    }

    return showConfirmDialogue
};

export default useCustomLogin