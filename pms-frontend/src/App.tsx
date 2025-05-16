import { useEffect, useState } from 'react'
import './index.css';
import './App.css'
import Home from './Components/pages/home';

  
    function App() {

     
      // function privilegeOfStrongNow(){
      //   function merge(array){
      //     const length = array.length;
      //     // const mid = Math.floor((length)/2);
      //     // console.log("mid: ", mid)
      //     // const firstHalf=array.slice(0,mid);
      //     // const lastHalf =array.slice(mid);
      
      //     return mergeSort(merge(firstHalf), merge(lastHalf))
      // }
    
      // function mergeSort(firstHalf, secondHalf){
      //   console.log("firstHalf ", firstHalf, " second Half ", secondHalf);
      // }
      // const my_array=[29, 17, 3, 21, 8, 15,11, 35];
      // merge(my_array);

      //     function zero_doubled(arr:Array<T>){

      //       console.log("array ", arr, "arrayLength: ", arr.length);
      //       let zeroCount = 0;
      //     const n = arr.length;
          
      //     // Step 1: Count zeros to determine the last valid element
      //     for (let i = 0; i < n; i++) {
      //         if (arr[i] === 0) zeroCount++;
      //     }
          
      //     // Step 2: Find the last position that fits in the array
      //     let lastPos = n - 1;
      //     while (zeroCount > 0 && lastPos >= 0) {
      //         if (arr[lastPos] === 0) zeroCount--;
      //         lastPos--;
      //     }
      //     console.log("zeroCount: ", zeroCount);
      //     console.log("lastPosition: after ", lastPos);
      //     }
      //     const my_array=[2, 13, 29, 0, 35, 0,3, 9, 6];
      //     zero_doubled(my_array)
      // }

  
   
 
      return (
        <div>
        <Home />
        </div>
      )
}

export default App

{/* <div className="bg-gray-50 min-h-screen py-10">
      <div className="bg-white shadow-md rounded:lg px-6 py-8 w-full mx-auto max-w-3xl"> */}