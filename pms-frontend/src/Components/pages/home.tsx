
import { useState } from "react";
import axios from "axios";


function Home(){

     const [userSearchValue, setUserSearchValue] = useState('');
  //   const handleButton = () => {
  // }

    const handleUserSearch = async(e:React.ChangeEvent<HTMLInputElement>) => {
    const searchValue=e.target.value;
     setUserSearchValue(searchValue);

     const response = await axios.get('http://localhost:2500/pms/getAllPatientsProfiles');
     console.log("response of getting all Patients: ", response )

   }
    
    return (
         <div className="bg-gray-100 flex justify-center min-h-screen">
          <div className="bg-white shadow-md rounded-lg px-3 py-3 w-full max-w-[480px] sm:max-w-3xl md:max-w-3xl lg:max-w-5xl h-[80vh] mt-20">
            <nav> 
              <header>
              </header>
            </nav>  
            <article>
              <div className='max-w-4/5 flex justify-center'>
                <section>
                  <label>Search Patient: </label>
                    <input type="search" 
                    className="p-2 border border-gray-800"
                    value={userSearchValue}
                    onChange={handleUserSearch}
                    name="search" />
                </section>
              </div>
           </article>
          </div>
       </div>
    )
}

export default Home