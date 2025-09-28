import { useCallback, useEffect, useState } from "react"
import makeNgrokRequest from "../ngrokRequesthook";
import { ScrollRestoration } from "react-router-dom";


const TopFacilities = () => {

    const [count,setCount] = useState(0);
    useEffect(() => {
        console.log("Top facilities are there! believe that ",count);
        
    }, [count])

    //  useEffect(() => {
    //     const countedValue = useCallback(() => {
    //         console.log("countedVAlue again dispalying ", count);
    //     },[])
    //     countedValue()
    // },[count])

    const handleAvgSalary = () => {
        async function getAvgSalary(){
            try{

            const response = await makeNgrokRequest({url:'pms/getDoctorsAverageSalary', method:'get'});

            console.log("response of average salarY: ", response);
            }catch(err){
                console.error("error while getting avg salary ", err);
            }
        }
        getAvgSalary();
    }
    const BaseImageStyling= "object-cover mx-auto max-w-sm rounded-xl shadow-lg shadow-transition hover:scale-105 transition-all duration-700";
    const BaseContainerStyle = 'grid grid-cols-1 md:grid-cols-2 gap-5 py-5';

   useEffect(() => {
        console.log(" count changed",count);
   },[count])

   useEffect(() => {
    console.log(" component renders ");
   },[])


    const handleUsecallback = () => {
      
        // function myFunction(names:string[], profession:Function){
        //     console.log("names: ",names);
        //     const receivedStudentProfessions = profession(names);
        //      return receivedStudentProfessions
        // }

        // const names= ['Ali', 'Faraz', 'Zeshan'];
        // const randomProfessionSelector = (students:string[]) => {
        //     const professions = [{
        //         0:'Eng',
        //         1:'Doc',
        //         2:'Tea'
        //     }]
        //     const profValues = Object.values(professions[0]);
        //     console.log(" values extracted; ",profValues);
        //     const studentProfessions = [];
        //     const profLen = Object.keys(professions[0]).length;
        //     for (let i = 0; i < students.length; i++){
        //         const magicNum =  Math.floor(Math.random() * profLen);
        //         const professionGot = profValues[magicNum];
        //         console.log(" profession Got for ", names[i], " profess", professionGot)
        //         studentProfessions.push(
        //             {'name': names[i],
        //                 profession: professionGot
        //             }
        //         )
        //     }

        //     return studentProfessions
            
            
        // }

        // const highLevel = myFunction(names, randomProfessionSelector);
        // console.log(" hight level ;", highLevel)
        setCount(prev => prev+1);
    }


    return (
        <div className="relative bg-gray-50">
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center sm:px-6 lg:px-8">
                <h1>i'm Here Alhamdulila</h1>
                <button onClick={handleAvgSalary} className="border-b border-gray-700 p-2 rounded-2xl bg-blue-400"> Get Avagrage Salary</button>
                
                <section  className="animate-fadeIn">
                    
                        <h1 className="text-blue-600 text-4xl m-5 border-b border-gray-200">One of The Superior and Extensive Patient Care</h1>
                        <button className="rounded-3xl bg-green-200 md:text-left"
                        onClick={handleUsecallback}>useCallback</button>
                        <button onClick={() => setCount(0)}>countReset</button>
                        <div className={`${BaseContainerStyle}`} >
                            
                            <p className="text-center leading-relaxed">Good patient care involves a comprehensive approach that considers the patient's physical, emotional, and mental well-being. It involves clear communication, building trust, and personalized treatment plans that take into account the patient's unique needs and preferences</p>
                            <img src="./patientFacilitiesCare.jpg" className={`${BaseImageStyling}`} />
                        </div>
                    

                </section>

                <section className="bg-gray-50">
                    <div className="text-center">
                        <h1 className="text-blue-600 text-4xl m-5 border-b border-gray-200">Renowned and highly Recommended Doctors</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                             <img src="patientFacilitiesDoctors.jpg" className={`${BaseImageStyling}`} />
                            <p className="text-center">Good patient care involves a comprehensive approach that considers the patient's physical, emotional, and mental well-being. It involves clear communication, building trust, and personalized treatment plans that take into account the patient's unique needs and preferences</p>
                        </div>
                    </div>
                </section>
                <section className="bg-white">
                   <div>
                     <h2 className="text-blue-600 text-2xl md:text-4xl m-5 border-b border-gray-200">WorldWide Patients</h2>
                      <div className={`${BaseContainerStyle}`} >
                             <p>Good patient care involves a comprehensive approach that considers the patient's physical, emotional, and mental well-being. It involves clear communication, building trust, and personalized treatment plans that take into account the patient's unique needs and preferences</p>
                             <img src="./topFacilitiesWorldwide.jpg" className={`${BaseImageStyling}`} />
                        </div>
                   

                   </div>
                </section>
                <section className="bg-gray-50">
                    <div>
                        <h1 className="text-blue-600 text-4xl m-5 border-b border-gray-200">top Class Care with Counselling</h1>
                         <div className={`${BaseContainerStyle}`}>
                            <img src="topFacilitiesCounselling.jpg" className={`float-left ${BaseImageStyling}`} />
                              <p>Good patient care involves a comprehensive approach that considers the patient's physical, emotional, and mental well-being. It involves clear communication, building trust, and personalized treatment plans that take into account the patient's unique needs and preferences</p>
                        </div>
                    </div>

                </section>
            </div>
        </div>
    )

}

export default TopFacilities

// https://share.google/aimode/rb3zADzj0eyszOO6q