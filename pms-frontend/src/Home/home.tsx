
import { useEffect, useRef } from "react";

import Navbar from '../Components/Navbar/navbar.tsx';
import HeroImage from "./heroImage.tsx";
import { ArrowRight, Users } from "lucide-react";
import { footerLinks, servicesImages, myIcons, termsAndConditions, doctorsSpecialities } from './homeData.tsx';
import {  Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/appContext.tsx";
import { flushSync } from "react-dom";
import NavigationDiagnostic from "./services/navigationDiagnostic.tsx";


function Home() {
  const navigate = useNavigate();
  const contactRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const {allDoctors} = useAuth();
//   class ListNode {
//     val:number
//     next:ListNode | null
//     constructor(val, next = null) {
//         this.val = (val === undefined ? 0 : val);
//         this.next = (next === undefined ? null : next);
//     }
// }

//   function isPalindrome(head:ListNode) {
//     let dummyNode = new ListNode(0);
//     dummyNode.next = head;

//     let fast = head;
//     let slow = head;

//     // Use fast and slow pointers to find the middle of the list
//     while (fast && fast.next !== null) {
//       if(slow.next){
//         slow = slow.next;
//       }
//       fast = fast?.next.next;
//     }

//     // A placeholder for the original comment line
//     // let mid = Math.floor(count/2);

//     // This section is a broken attempt at reversing the list
//     let prev = null;
//     let curr = head; // This should be 'slow' to reverse the second half

//     while (curr !== null) {
//         const nextNode = slow.next;
//         slow.next = prev;
//         prev = slow;
//         slow = nextNode;
//         curr = curr.next; // This line causes an issue since 'curr' is not being iterated correctly
//     }
    
//     // The following log statements are for debugging and showing the state
//     console.log("slow: ", slow); // This will show null if the reversal completes
//     console.log("reversed half (prev): ", prev);
//     console.log("current: ", curr); // This will show null if the reversal completes

//     // The original code has no comparison logic and always returns false
//     return false;
// }

// // --- Example Usage and Setup for Debugging ---
// function setupAndRun() {
//     // Example 1: Create a simple linked list that is a palindrome (1 -> 2 -> 2 -> 1)
//     let palindromeList = new ListNode(1);
//     palindromeList.next = new ListNode(2);
//     palindromeList.next.next = new ListNode(2);
//     palindromeList.next.next.next = new ListNode(1);

//     console.log("Running isPalindrome on a palindrome list...");
//     let result1 = isPalindrome(palindromeList);
//     console.log("Is palindrome? ", result1);
//     console.log("---");

//     // Example 2: Create a simple linked list that is not a palindrome (1 -> 2 -> 3)
//     let nonPalindromeList = new ListNode(1);
//     nonPalindromeList.next = new ListNode(2);
//     nonPalindromeList.next.next = new ListNode(3);

//     console.log("Running isPalindrome on a non-palindrome list...");
//     let result2 = isPalindrome(nonPalindromeList);
//     console.log("Is palindrome? ", result2);
// }

// // Call the setup and run function
// setupAndRun();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    console.log("this i sthe userRole ", userRole, " AllDoctors ", allDoctors);
  }, [])

  function learning(){
    // console.log("LEARN More has been callsed")
    // const binarydata= [3,9,12, 16,20,27,28, 29,30,35,66,892];
    // function bubbleSort(limit:number, data:number[], data2:number[]){

    //   if(limit <= 1){
    //     return 1
    //   }
    //   let mid = Math.floor(data.length / 2);
    //   const leftSide = data.slice(0,mid);
    //   const rightSide = data.slice(mid);
    //   console.log("left half ", leftSide);
    //   console.log("right half ", rightSide);
    //   return bubbleSort(mid, sort(leftSide),sort(rightSide))
    // }

    
    // const res = bubbleSort(binarydata.length, binarydata);
    // console.log(" fact result ", res)





    // function binarySearch(arr:number[], n:number){
    //   let s = 0;
    //   let e = arr.length - 1;
    //   if(arr.length === 0){
    //     return 'there is no data';
    //   }
    //   while(s <= e){
    //     const mid = Math.floor((s+e) / 2);
    //     console.log("mid: " ,mid);
    //     if(arr[mid] === n){
    //       console.log("number found ", arr[mid], " at index: ", mid);
    //       return "number is Found"
    //     }
    //     if(arr[mid] < n){
    //       console.log("mid: less than number  mid" ,arr[mid], " num ", n );
    //       s = mid + 1;
    //     }
    //     if(arr[mid] > n){
    //       console.log("mid: greater than number  mid" ,arr[mid], " num ", n );
    //       e= mid - 1;
    //     }
    //   }

    //   return " number not found";
    // }
    // const numberToFind = 20;
    // binarySearch(binarydata, numberToFind)


    // MERGED AREA
//     const merge = (leftArr, rightArr) => {
//     let sortedArr = [];
//     let leftIndex = 0;
//     let rightIndex = 0;

//   // Compare elements from both arrays and add the smaller one
//     while (leftIndex < leftArr.length && rightIndex < rightArr.length) {
//       if (leftArr[leftIndex] < rightArr[rightIndex]) {
//         sortedArr.push(leftArr[leftIndex]);
//         leftIndex++;
//       } else {
//         sortedArr.push(rightArr[rightIndex]);
//         rightIndex++;
//       }
//     }

//   // Add any remaining elements from either array
//   return [...sortedArr, ...leftArr.slice(leftIndex), ...rightArr.slice(rightIndex)];
// };

// function mergeSort(dataArr:number[]) {
//   // Base case: An array with 1 or 0 elements is already sorted
//   if (dataArr.length <= 1) {
//     return dataArr; // Return the array itself, not its length.
//   }

//   // Divide the array into two halves
//   const half = Math.floor(dataArr.length / 2);
//   const firstHalf = dataArr.slice(0, half);
//   const lastHalf = dataArr.slice(half);

//   // Recursively sort the two halves and then merge the result
//   console.log("firstHalf ", firstHalf, " lastHalf ", lastHalf);
//   return merge(mergeSort(firstHalf), mergeSort(lastHalf));
//   }

//   const binarydata = [3, 9, 12, 16, 20, 27, 28, 29, 30, 35, 66, 892];
//   // const mySortedList = mergeSort(binarydata);
//   console.log(" mySorted List: ", mySortedList);


// MERGE SORT


// const merge = (first:number[], sec:number[]) => {
//   console.log(" inside Merge ", first, ' sec ', sec);
  

// }
//     const mergeSort = (myList:number[]):number[] => {
//       let listLength = myList.length;

//       if(listLength <= 1){
//         return myList
//       }
//       const mid = Math.floor(listLength/2);
//       const leftHalf= myList.slice(0, mid);
//       const rightHalf = myList.slice(mid);
//       console.log("inside mergeSort ", leftHalf , "rigthHalf ", rightHalf)
//       return merge(mergeSort(leftHalf), mergeSort(rightHalf))
//     }

//     const numList = [7, 1, 4, 12];
//     const result = mergeSort(numList);
//     console.log("final result mergeSort ", result);

const text = 'Resilience And Blessings';
    function reverseString(text:string, index:number):string{

      if(index <= 0){
        return text[0];
      }

      // reversed = reversed + text[index];
      // console.log("reversed each ", reversed)
       return text[index] + reverseString(text, index-1);
      
    }
    const length = text.length-1;
    
    const result = reverseString(text, length);

    console.log("result of reversed: ", result);

}

const handleSpecialityClick = (targetSpeciality:string) => {
  
  console.log("targetSpeciality ",targetSpeciality);
  navigate('/doctorsBySpeciality', {state:{targetField:targetSpeciality}})
}

  const handleServicesClick = (service:{title:string}) => {
    console.log("clicked service: ", service);
    if(service.title === 'Nursing Care'){
      navigate('/nursingCare');
    }
    else if(service.title === 'Diagnostic Center'){
      navigate('/diagnosticCenter');
    }
    else if(service.title === 'Our Doctors'){
      navigate('/ourDoctors');
    }
  }

   const handleDoctorsClick = (service:{title:string}) => {
    console.log("clicked service: ", service);
    if(service.title === 'Nursing Care'){
      navigate('/nursingCare');
    }
  }
   const handleDiagnosticClick = (service:{title:string}) => {
    console.log("clicked service: ", service);
    if(service.title === 'Nursing Care'){
      navigate('/nursingCare');
    }
  }
  // const handleAlmondsCallback = useCallback(() => {
  //   console.log("Almonds new value callback ",almonds )
  // },[almonds])
// first:'With your Nafs', second:'With your external environment'
 
  return (
    <>
      <section className="Hero-Section relative bg-gradient-to-r from-purple-50 to-white">
        <Navbar servicesRef={servicesRef} contactRef={contactRef} />
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-4 py-8">
          <h1 className="text-4xl md:text-5xl mt-5 font-bold text-yellow-600">
            Your health our priority
          </h1>
          <HeroImage />
          <h1 className="text-4xl md:text-5xl mt-5 font-bold text-gray-800">
            Book your Appointment
          </h1>
          <p className="text-lg mt-4 text-gray-600">
            Book appointments with trusted healthcare professionals in just few clicks
          </p>
          <div className="mt-6 flex justify-center gap-5">
            <button onClick={function(){navigate('/MakeAppointment')}}
              className="text-white px-4 py-2 md:px-6 md:py-3 rounded-full bg-purple-500 hover:bg-purple-600 transition">
              Book Appointment
            </button>
            <button onClick = {() => learning() } className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:text-purple-700 hover:border-purple-600 transition">
              Learn More
            </button>
             <button 
             onClick={() => navigate('/portfolioPage')}
             className="px-5 py-2 border border-gray-300 rounded-md hover:text-green-600 hover:border-green-700">
              Portfolio
            </button>
          </div>
        </div>
      </section>
      <section className="Achievements-Section relative bg-gradient-to-r from-purple-50 to-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-5">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl md:text-5xl mt-5 font-bold text-gray-800">
                Treatment & Relief starts here
              </h1>
              <p className="text-md mt-4 text-gray-600">
                All the healthcare services in just one place.
                Team of Best Professionals committed to provide the best Care.
              </p>
              <div className="flex flex-col gap-4">
                <p className="mt-4 text-gray-600">Why You must come Here first</p>
                <button 
                onClick={() => navigate('/topFacilities')}
                className="block px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:text-purple-700 hover:border-purple-600 transition">
                  Learn More
                </button>
              </div>

            </div>
            <div className="mt-4">
              <img className="w-full max-w-sm md:max-w-sm lg:max-w-md rounded-2xl shadow-lg shadow-transition object-cover hover:scale-105 duration-300" src="/relief.jpg" alt={"Treatment & Relief"} />
            </div>
          </div>
        </div>
      </section>
      <section className="DoctorsBySpeciality-Section relative bg-gradient-to-r from-purple-50 to-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-6 py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl mt-5 font-bold text-gray-800">
              Browse Doctors By Speciality
            </h1>
            <p className="text-md mt-4 text-gray-600">
              the team of best doctors serving with passion for the cure of humanity.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 items-center gap-5 mt-6">
              {doctorsSpecialities.map((doctors, ind) => (
                <button key={ind}
                onClick={() => handleSpecialityClick(doctors.speciality)}
                  className="flex flex-col items-center justify-center cursor-pointer 
                bg-white shadow-md px-5 py-6 min-h-[150px] transition-all
                duration-300 rounded-2xl border-transparent hover:shadow-xl
                 hover:scale-[1.02] hover:border-purple-400 hover:shadow-purple-100">

                  <span className="p-2 bg-purple-50 rounded-full hover:bg-purple-100">
                    {doctors.logo}
                  </span>
                  <h2 className="font-medium text-center text-sm md:text-base my-5 ">{doctors.speciality}</h2>
                  {/* <div className="flex gap-2">
                    <p className="text-xs text-gray-500 mt-1">{doctors.strength}</p>
                    <Users size={16} className="text-purple-400 mt-0.5" />
                  </div> */}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>
      <section ref={servicesRef} className="Services-Section bg-gradient-to-br from-purple-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Care Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              End-to-end healthcare solutions from home visits to advanced diagnostics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center ">
            {servicesImages.map((service, index) => (
              <div key={index} className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-md
                ${servicesImages.length % 2 !== 0 && index === servicesImages.length - 1 ? 'md:col-span-2 md:flex md:justify-center lg:col-span-1' : ''}`} 
               >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={service.path}
                    alt={service.alt}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 z-20">
                  <button className="w-full py-3 px-6 bg-white text-purple-700 font-medium rounded-full 
                         hover:bg-purple-50 transition-all duration-300 
                         translate-y-2 group-hover:translate-y-0 
                         opacity-0 group-hover:opacity-100 flex items-center justify-center"
                          onClick={() => handleServicesClick(service)}
                          >
                    {service.title}
                    <ArrowRight className="text-blue-500 inline ml-2 h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white 
                pb-24 group-hover:pb-32 transition-all duration-300 z-10">
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="text-sm opacity-90">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
         
        </div>
      </section>
      <footer className="Footer relative bg-gradient-to-r from-purple-50 to-white border-t border-gray-200 mt-16">
        <div className="bg-gray-50 flex justify-center items-center py-12">
          <div className="flex gap-4 md:gap-6 flex-wrap justify-center px-4">
            {myIcons.map((icon, ind) => (
              <button className="rounded-full" key={ind} aria-label={`Follow us on ${icon.type}`}>
                {icon.logo}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border-b border-gray-200 pb-8 gap-8">
            {
              footerLinks.map((links, index) => (
                <div className="flex flex-col" key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 uppercase mb-4 tracking-wide">
                    {links.name}
                  </h3>
                  <div className="flex flex-col">
                    {links.data.map((link, ind) => {
                      return (
                        <a
                          key={ind}
                          href="#"
                          className="text-sm text-left text-gray-600 hover:text-purple-700 mb-3">
                          {link}
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))
            }
          </div>
          {/* grid grid-rows-4 md:grid-rows-2 grid-flow-col */}
          <div className="pt-8 pb-6" ref={contactRef} >
            <div className="flex flex-wrap justify-center items-center gap-4 my-3 text-xs text-gray-500 mb-3">
              {termsAndConditions.map((term, ind) => {
                return (
                  // <div className="flex justify-center items-center ">
                  <a
                    key={ind}
                    href="#"
                    className="flex hover:text-purple-700 text-xs">
                    {term}
                  </a>

                )
              })}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">+92 301 2707036, 042 9375214, 042 5423214 | medicare@gmail.com</p>
              <p className="text-sm text-gray-600">Lahore 42000 | &copy; 2025 MediCare for Public, Medical Education and Research. All Rights Reserved</p>
            </div>
          </div>
        </div>
      </footer>
      {/* <ScrollRestoration /> */}
    </>

  )
}

export default Home

// aga@gmail.com aga@3344
// raas@gmail.com raas$0022
// Attend 1 Lahore meetup (GDG, Colabs, Daftarkhwan, kickstart, the hive etc.).
// LinkedIn Events Search:


// Search “Lahore developer meetup” or “React Lahore” — filter by Events.

// bash
// git checkout main
// git pull origin main
// Use code with caution.

// Create your feature branch. Create and switch to a new branch for your task.
// bash
// git checkout -b feature/patientProfile
// Use code with caution.

// Work and commit locally. Make your changes, add and commit them. Continue to do this as you make progress on the feature.
// bash
// git add .
// git commit -m "feat: Add patient profile interface"
// Use code with caution.

// Push your feature branch. When you are ready to share your work or are finished with the feature, push your branch to the remote repository.
// bash
// git push -u origin feature/patientProfile
// Search “Lahore developer meetup” or “React Lahore” — filter by Events.

