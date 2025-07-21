import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import {debounce} from 'lodash';
import { FaSpinner, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from '../Navbar/navbar.tsx'

 interface Patient{
  _id:string,
  patientName:string,
  patientId:string,
  age?:string,
  diagnosis:string,
  city:string
}



function DoctorDashboard(){

     const [userSearchValue, setUserSearchValue] = useState('');
     const [patientsProfiles, setPatientsPrfiles] = useState<Patient[]>([]);
     const [loadingSearchedPatients, setLoadingSearchedPatients] = useState(false);
     const [doesUserSearch, setDoesUserSearch] = useState(false);

   const navigate = useNavigate();
    const handleAddPatientClick = () => {
    navigate('/doctor-dashboard/addPatient')
  }

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    function openDashboard(){
      if(!role) return "Role is not Defined";

      // console.log("role of the user inside HOME ",role);
      // if(role === 'patient'){
      //   navigate('/patient-dashboard');
      // }
    }
    openDashboard()
  },[])
  const debounceSearchPatient = useMemo( 
      () => debounce(async(value:string) => {
        setLoadingSearchedPatients(true);
        try{
      
          const response = await axios.get(`http://localhost:2500/pms/searchPatient?search=${value}`);
        
          console.log("this is the response: of searchIng,", response.data.success );
          if(response.data.success){
            console.log("response.data if searched response successful ", response.data);
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
    const searchValue=e.target.value;
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


     useEffect(() => {
      async function fetchPatients(){
        const response = await axios.get('http://localhost:2500/pms/getAllPatientsProfiles');
        console.log("response: ", response);
      } 
      fetchPatients();
   },[])

   function handlePatientClick(id:string, name:string){
    
    console.log("patient clicked ", id, "patient Name: ",name);
    navigate(`/profile/${id}`);

   }
    return (
      <>
        <Navbar />
        <Outlet />
        <div className="bg-gray-200 flex justify-center min-h-screen">
          <div className="bg-white shadow-md rounded-lg px-3 py-3 w-full max-w-[480px] sm:max-w-3xl md:max-w-3xl lg:max-w-5xl h-[80vh] mt-12">
            <nav> 
              <header>
              </header>
            </nav>  
            <article>
              <div className='max-w-4/5 flex justify-center sm:space-x-16 relative gap-8'>
                <section>
                  {/* <label>Search Patient: </label> */}
                    <input type="search" 
                    className="p-3 border border-gray-800"
                    placeholder="Search Patient.."
                    value={userSearchValue}
                    onChange={handleUserSearch}
                    name="search" />
                </section>
                <div className="flex">
                   <button onClick={handleAddPatientClick} className="flex gap-2 border border-gray-800 bg-purple-600 text-white text-[12px] sm:p-2 sm:text-lg sm:w-40"> New Patient <FaUserPlus /> </button>
                </div>
               
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
      </>
         
    )
}

export default DoctorDashboard