
import { useEffect, useMemo, useState } from "react";
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



function Home(){

     
    return (
      <>
        <Navbar />
        <section>
          <header>
            <div className="m-5">
               {/* sm:max-w-lg md:max-w-xl lg:w-full */}
              <img src={'/public/mediCare.jpg'} alt={`hero-image`} className="w-full position-center object-fit" />
            </div>
          </header>
        </section>
        <article>
          <h1> 
            Find the Best Doctors
          </h1>
        </article>
      </>
         
    )
}

export default Home

      