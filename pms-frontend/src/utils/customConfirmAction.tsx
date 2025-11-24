
import toast from "react-hot-toast"



const useConfirmAction = (action:string) => {


    const confirmAction = () => { 
        return new Promise((resolve) => {
            toast((t) => 
               {
                return (
                     <div className="flex flex-col items-center">
                    <span> Do you really want to {action} the Slot</span>
                   <div className="flex justify-between">
                     <button 
                      className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:!bg-red-600 "
                    onClick={() => {
                        toast.dismiss(t.id);
                        resolve(true)
                    }}> Yes</button>
                    <button 
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:!bg-gray-400"
                    onClick={() => {
                        toast.dismiss(t.id);
                        resolve(false)
                    }}> No</button>
                   </div>
                </div>    
                )
               },
               {
                duration:Infinity
               }
            )
        })
        
    }

    return confirmAction()
}

export default useConfirmAction