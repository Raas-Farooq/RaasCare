// import Navbar from "../Navbar/navbar"


function AdminDashboard(){


    return (
        <>
            <section>
    
                <main>
                <header className="w-full flex justify-between">
                    <h1 className="text-purple-700 flex items-center justify-center"> Admin Name </h1>
                    <img src='/willingToDo.jpg' alt="adminProfileImage" className=" w-24 h-auto" />
                </header>   
                <article className="flex ml-[6vw] justify-center p-10">

                    <form className="flex gap-4">
                        <button 
                        className="border border-gray-600 border-b p-2 rounded-lg text-gray-700 hover:text-purple-900 hover:bg-purple-300"
                        > Home 
                        </button>
                        <button 
                        className="border border-gray-600 p-2 rounded-lg text-gray-700 hover:text-purple-900 hover:bg-purple-300"
                        > Update Doctor Profile 
                        </button>
                        <button 
                        className="border border-gray-600 p-2 rounded-lg text-gray-700 hover:text-purple-900 hover:bg-purple-300"
                        > Add Doctor 
                        </button>
                        <button 
                        className="border border-gray-600 p-2 rounded-lg text-gray-700 hover:text-purple-900 hover:bg-purple-300"
                        > Manage Bookings 
                        </button>
                       

                    </form>
                </article>
                </main>
            </section>   
        </>
    )
}

export default AdminDashboard