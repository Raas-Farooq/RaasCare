
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Function to call when user confirms
const useConfirmNavigation = () => {
    const navigate = useNavigate();

    const showConfirmDialogue = () => {

        return new Promise(resolve => {
            toast((t) => (
                <div className="flex flex-col items-center">
                    <span>Please log in to confirm your appointment.</span>
                    <div className="mt-4">
                        <button
                            onClick={() => {
                                navigate('/login');
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
                // Optional: configure the toast behavior
                duration: Infinity, // Keep toast until user action
            });
        })
    }

    return showConfirmDialogue
};

export default useConfirmNavigation