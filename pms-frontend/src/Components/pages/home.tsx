
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {debounce} from 'lodash';
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Patient{
  _id:string,
  patientName:string,
  patientId:string,
  age?:string,
  diagnosis:string,
  city:string
}


function Home(){

     const [userSearchValue, setUserSearchValue] = useState('');
     const [patientsProfiles, setPatientsPrfiles] = useState<Patient[]>([]);
     const [loadingSearchedPatients, setLoadingSearchedPatients] = useState(false);
     const [doesUserSearch, setDoesUserSearch] = useState(false);

   const navigate = useNavigate();
    const handleButton = () => {
    
  }

  const debounceSearchPatient = useMemo( 
      () => debounce(async(value:string) => {
        setLoadingSearchedPatients(true);
        try{
      
          const response = await axios.get(`http://localhost:2500/pms/searchPatient?search=${value}`);
        
          console.log("this is the response: of searchIng,", response.data.success );
          if(response.data.success){
            setPatientsPrfiles(response.data.patients)
          }else{
            console.log("else Runnnn")
            setPatientsPrfiles([]);
          }
        }
        catch(err){
          if(axios.isAxiosError(err) && err?.response?.status === 404){
            setPatientsPrfiles([]);
          }
          else{
            console.error("got error while fetching patients: ", err);
          }
          
        }
        finally{
          setLoadingSearchedPatients(false)
        }
      }, 300),
    []);

    const handleUserSearch = async(e:React.ChangeEvent<HTMLInputElement>) => {
    const searchValue=e.target.value.trim();
    setUserSearchValue(searchValue);
    setDoesUserSearch(true);
    if(!searchValue || searchValue.trim() === ""){
      setPatientsPrfiles([]);
    }
     debounceSearchPatient(searchValue);
   }
    
   useEffect(() => {
    return () => {
      debounceSearchPatient.cancel();
    }
   },[]);


    //  useEffect(() => {
  //     async function fetchPatients(){
  //       const response = await axios.get('http://localhost:2500/pms/getAllPatientsProfiles');
  //       console.log("response: ", response);
  //     } 
  //     fetchPatients();
  //  },[])

   function handlePatientClick(id:string, name:string){

    console.log("patient clicked ", id, "patient Name: ",name);
    navigate(`/profile/${id}`);

   }
    return (
         <div className="bg-gray-200 flex justify-center min-h-screen">
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
                <button onClick={handleButton} className="border border-gray-800 bg-purple-600 text-white"> Allah Akbar</button>
              </div>
           </article>
           {loadingSearchedPatients && <div><FaSpinner className="animate-spin " />   </div>}
           <article>
            <>
              {patientsProfiles.length === 0 && doesUserSearch &&  
                <div>
                  <h2>No Patient Found</h2>  
                </div>
              }
            </>
            <div>
              {patientsProfiles?.map(patient => {
                return(
                  <div key={patient?._id}>
                    <button onClick={() => handlePatientClick(patient?.patientId,patient?.patientName)} className="pointer text-blue-500 hover:text-blue-700 ">{patient.patientName}</button>
                  </div>
                )
              })}
            </div>
            
           </article>
          </div>
       </div>
    )
}

export default Home

// function mergeArrays(first_array:number[], second_array:number[]){
//         let i = first_array.length - 1;
//         let j = second_array.length - 1;
//         let total_length = i + j + 1;
//         while(i >= 0 && j >= 0){
//           if(first_array[i] > second_array[j]){
//             first_array[total_length] = first_array[i];
//             i--;
//           }else{
//             first_array[total_length] = second_array[j];
//             j--
//           }
//           total_length--;
//         }
//         while (j >= 0 && total_length>= 0){
//         first_array[total_length] = second_array[j];
//         j--;
//         total_length--;
//         }
//       }

      