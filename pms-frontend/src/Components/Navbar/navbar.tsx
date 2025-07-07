import { useEffect, useState } from "react"
import { FaBars, FaTimes } from "react-icons/fa"
import useWindowSize from "./windowSize";
import { useNavigate } from "react-router-dom";
import axios from "axios";



const Navbar = () => {
    const [isShowMenu, setIsShowMenu] = useState(false);
    const {width} = useWindowSize();
    const navigate = useNavigate();
    function handleMenuClick(){
            setIsShowMenu(!isShowMenu);
    }

    // useEffect(() => {
    //     async function fetchUsers(){
    //        try{
    //              const allUsers= await axios.get('http://localhost:2500/pms/getAllUsers');
    //             console.log("allUsers: ", allUsers);
    //        }catch(err){
    //             console.error('err while making request to fetch All users ', err);
    //        }
    //     }
    //     fetchUsers();
    // },[])
    // class Node{
    //     next: Node | null;
    //     data:number

    //     constructor(data:number){
    //         this.data = data,
    //         this.next = null
    //     }
    // }

    // class LinkedList{
    //     head:Node | null;
    //     length:number
    //     constructor(){
    //         this.head=null,
    //         this.length=0
    //     }


    //     appendBeginning(data:number){
    //         const newNode = new Node(data);
    //         const curr = this.head;
    //         newNode.next= curr;
    //         this.head=newNode;
    //         this.length++
            
    //     }
    //     appendAtEnd(data:number){
    //         const newNode =new Node(data);
    //         let curr = this.head;
    //         if(!curr){
    //             this.head=newNode;
    //         }else{
    //             while(curr.next){
    //                 curr = curr.next;
    //             }
    //             curr.next=newNode; 
    //         }
    //         this.length++;
    //     }
    //     print():void{
    //         let result = "";
    //         let current = this.head;
    //         while(current){
    //              result+= current.data + " -> "
    //             current = current.next;
                
                
    //         }
    //         // result+= 'Null';
    //         console.log("result: ", result);
    //     }
    //     appendAtIndex(data:number, index:number){

    //         if(index < 0 || index > this.length){
    //             return "invalid Index"
    //         }

    //         if(index === 0){
    //             this.appendBeginning(data)
    //         }
    //         if(index === this.length){
    //             this.appendAtEnd(data);
    //         }

    //         let count = 0;
    //         const newNode=new Node(data);
    //         let current = this.head;

    //         while(count <= index-1 && current){
    //             count++;
    //             current = current?.next;
    //         }
    //         if(current){
    //             newNode.next= current.next;
    //             current.next = newNode;
    //             this.length++;
    //         }
    //     }

    //     deleteAtIndex(index:number){
    //         if(index < 0 || index >= this.length){
    //             throw new Error("invalid Index..no node at this index")
    //         }
    //         if(index === 0){
    //             if(this.head){
    //                 this.head = this.head.next;
    //                 // this.head.next = this.head;
    //                 this.length--;
    //                 return;
    //             }
    //         }
            
    //         let current = this.head;
    //         if(!current){
    //             throw new Error("no node is available")
    //         }
    //         let count =0;
    //         while(count <= index-1 && current){
    //             current=current.next;
    //             count++
    //         }
    //         if(current && current.next){
    //             current.next = current.next?.next;
    //             this.length--
    //         }
    //     }
    // }

    // useEffect(() => {
    //     const list= new LinkedList();
    //     list.appendBeginning(99);
    //     list.appendAtEnd(39);
    //     list.appendAtIndex(540, 1);
    //     list.print();
    // },[])
    
    useEffect(() => {
        
        if(width>1024){
            setIsShowMenu(false);
        }
    },[width])

   function handleRegister(){

    navigate('/register')
   }

   function handleLogin(){
    navigate('/login');
   }

    return (
        <div className={`flex items-center flex-wrap justify-between relative ${isShowMenu ? 'lg:h-auto': ''}`}>
            <header className="font-bold text-3xl ">
                MediCare
            </header>
            <div>
                <button 
                onClick={handleMenuClick} 
                aria-label="toggle Menu"
                aria-expanded={isShowMenu}
                className="text-3xl lg:hidden ml-auto transition: all 0.3s ease-in-out">
                
                    {isShowMenu ? <FaTimes /> : <FaBars /> } 
                    </button>
            </div>
            <nav className={`w-full lg:w-auto ${isShowMenu ? 'block absolute top-full left-0 bg-white shadow-lg z-50 p-4' : 'hidden lg:block'}`}
            aria-labelledby="main-navigation" >
                <ul className={`flex flex-col lg:flex-row gap-6 ${isShowMenu ? 'py-4' : ''}`}>
                    {['Services', 'Book Appointment', 'Awards', 'Contact', 'About'].map((tab, ind) => (
                         <li key={ind}><a href="#" className="hover:text-purple-600 hover:scale-105 transition-transform block focus:outline-none focus:bg-purple-400 focus:rounded-md text-lg"> {tab} </a></li>
                    ))}
                </ul>
            </nav>
            <div className={`w-full lg:w-auto ${isShowMenu ? 'block bg-white pb-4 px-4' : 'hidden lg:flex'} gap-4`}>
                <button 
                onClick={handleLogin} 
                className="text-lg hover:scale-110 transition-transform block w-full lg:w-auto text-left lg:text-center px-4 py-2 hover:text-purple-600">
            LogIn
        </button>
        <button 
        onClick={handleRegister}
        className="border border-gray-700 bg-purple-400 rounded-full shadow-xl px-6 py-2 hover:bg-purple-500 transition-colors w-full lg:w-auto text-center">
            Get Started
        </button>
            </div>
        </div>
    )
}

export default Navbar