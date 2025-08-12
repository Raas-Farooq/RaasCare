import axios, { type AxiosInstance } from "axios";
import React, { useCallback, useContext, useEffect, useState, type SetStateAction } from "react";
import toast from "react-hot-toast";

interface User{
    username:string,
    id:string,
    email?:string,
    role:string
}

declare global {
    interface Window {
        axios:AxiosInstance
    }
}
interface AuthContextProps{
    user:User | null;
    expiryTime:number | null;
    jwt_token:string | null;
    userRole:string | '';
    isAuthenticated:boolean;
    loading:boolean,
    setLoading:React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuthenticated:React.Dispatch<React.SetStateAction<boolean>>;
    setUserRole:React.Dispatch<React.SetStateAction<string | ''>>;
    login: (user: User, token: string, expiresInSec: number) => void;
    logout: ()=>void;
    setExpiryTime:React.Dispatch<React.SetStateAction<number | null>>;
    setUser:React.Dispatch<SetStateAction<User | null>>;
    setJwt_token:React.Dispatch<SetStateAction<string | null>>;
    
}

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [jwt_token, setJwt_token] = useState<string | null>(null);
    const [expiryTime, setExpiryTime] = useState<number | null>(null);
    const [userRole, setUserRole] = useState<string | ''>('');
    const [loading,setLoading] = useState<boolean>(true);
    let logoutTimer:NodeJS.Timeout | undefined;

    const logout = useCallback(async() => {
        alert("LOGOUT RUNS")
        try{
            const logoutResponse = await axios.get('http://localhost:2500/pms/logout',
                {withCredentials:true}
            );
        }catch(err){
            console.error("Error while clearing Cookie",err)
        }
        setExpiryTime(null);
        setJwt_token(null);
        setUser(null);
        setUserRole('');
        setIsAuthenticated(false);
        localStorage.removeItem('auth');
        if(logoutTimer){
            clearTimeout(logoutTimer)
        }

    },[]);

    const scheduledLogout = useCallback((exp:number) => {
        const timeLeft = exp - Date.now();
        console.log("timeLeft: ", timeLeft);
        if(timeLeft > 0){
            logoutTimer = setTimeout(logout,timeLeft)
        }else{
            logout()
        }
    },[logout])


    const login = (user:User, token:string, expiresInSec:number) => {
        setUser(user);
        setJwt_token(token);
        setUserRole(user.role);
        setIsAuthenticated(true);
        const expiryInSeconds = Date.now() + expiresInSec * 1000;
        setExpiryTime(expiryInSeconds); 
        localStorage.setItem('auth', JSON.stringify({
            user:user,
            jwt_token:token,
            expiryTime:expiryInSeconds,
            userRole:user.role,
            isAuthenticated:true
        })
        )
        
        scheduledLogout(expiryInSeconds)
    } 

    
    useEffect(() => {
        console.log("Inside ProtectedRoute  isAuthenticated: ", isAuthenticated, "userRole ", userRole)
    },[])

    useEffect(() => {
        
        const localSavedData = localStorage.getItem('auth');
        console.log("if you have refreshsed: ", localSavedData);
        if(localSavedData){
            const {user, expiryTime, jwt_token,userRole, isAuthenticated} = JSON.parse(localSavedData);
            if(Date.now() < expiryTime){
                setUser(user);
                setJwt_token(jwt_token);
                setExpiryTime(expiryTime);
                setUserRole(userRole);
                setIsAuthenticated(isAuthenticated);
                scheduledLogout(expiryTime);
            }else{
                logout();
            }
        }else{
            logout();
        }
    
        setLoading(false);

    },[logout, scheduledLogout])
    
    useEffect(() => {
        const axiosInstance = axios.create({
            baseURL:`http://localhost:2500/pms`,
            withCredentials:true
        })

        axiosInstance.interceptors.request.use((config) => {
            if(jwt_token){
                config.headers.Authorization = `Bearer ${jwt_token}`
            }
            return config;
        })

        axiosInstance.interceptors.response.use((res) => res,
        (err) => {
            if(err.response.status === 401){
                logout()
            }
            return Promise.reject(err);
        })

        window.axios = axiosInstance
    },[jwt_token, logout])
    


    return (
        <AuthContext.Provider value={{loading, setLoading,isAuthenticated, setIsAuthenticated, user, setUserRole,userRole,jwt_token, expiryTime, login, logout, setUser, setExpiryTime, setJwt_token}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth =() =>{
    const context = useContext(AuthContext);
   if(!context){
        throw new Error('AuthenContext can only use within AuthenContext Provider')
    }

    return context
}