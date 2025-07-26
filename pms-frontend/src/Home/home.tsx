
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
// import {debounce} from 'lodash';
// import { FaSpinner, FaUserPlus } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar/navbar";

 interface Patient{
  _id:string,
  patientName:string,
  patientId:string,
  age?:string,
  diagnosis:string,
  city:string
}



function Home(){
  
  useEffect(() => {


    const addPatientDetail = async () =>{
      try{
        const updateResponse=await axios.post(`http://localhost:2500/pms/addPatientProfile`,{
          patientId:'9373853895',
          patientName:'Rashida',
          city:'Gujrat',
          age:65,
          gender:'female',
          medicalHistory:[{
            date:new Date(),
            diagnosis:'hypertension',
            treatment:'initial Medicines',
          }]
        });
        console.log("updateResponse patient: ", updateResponse);
      }
      catch(err){
        console.error('got error while fetcing all admins: ', err);
      }
    }
    addPatientDetail();
  })
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    console.log("this i sthe userRole ", userRole);
  },[])
     
    return (
      <>
        <Navbar />
        <section>
          <header className="flex flex-col items-center">
            <div className="w-full max-w-[90vw] h-auto md:max-w-3xl m-5">
               {/* sm:max-w-lg md:max-w-xl lg:w-full */}
              <img 
              src={'/MedicoHero.jpg'}
               alt={`hero-image`}
                className="w-full h-auto max-h-[70vh] rounded-md shadow-md object-cover" />
            </div>
          </header>
        </section>
        <article>
          <h1 className="text-4xl"> 
            Find the Best Doctors
          </h1>
        </article>
      </>
         
    )
}

export default Home

// aga@gmail.com aga@3344
// raas@gmail.com raas$0022

//has to ask about usage of curly braces with Route:- when using with object we don't use {} with 'element' but why use when then when Route is not sorrounded by object?