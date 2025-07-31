
import { useEffect } from "react";


// class Node {
//   constructor(val) {
//     this.val = val;
//     this.next = null;
//   }
// }

// class LinkedList {
//   constructor() {
//     this.head = null;
//     this.length = 0;
//   }

//   addAtHead(val) {
//     const node = new Node(val);
//     let current = this.head;
//     if (current) {
//       node.next = current;
//       // The line 'current = this.head;' here is redundant and can be removed
//       // as 'current' is not used after this point in this method.
//     }
//     this.head = node;
//     this.length++; // Increment length when adding a node
//   }

//   removeAtIndex(index) {
//     if (index < 0 || index >= this.length) { // Corrected condition for valid index
//       return null;
//     }

//     if (index === 0) { // Handle removal of head
//       this.head = this.head.next;
//       this.length--;
//       return;
//     }

//     let count = 0;
//     let current = this.head;
//     let prev = null;

//     while (count < index && current) {
//       prev = current;
//       count++;
//       current = current.next;
//     }

//     if (prev && current) {
//       prev.next = current.next;
//       this.length--; // Decrement length when removing a node
//     }
//   }
// }



  
function Home(){
     
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    console.log("this i sthe userRole ", userRole);
  },[])
     
    return (
      <>
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