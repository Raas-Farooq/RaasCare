
import { useEffect } from "react";
import Navbar from "../Components/Navbar/navbar";




  
function Home(){
     
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