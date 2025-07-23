import React, { useContext, useState } from "react";

interface AuthContextProps{
    isAuthenticated:boolean,
    userRole:string,
    isLoggedIn:boolean
}

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(
        'patient'
    );
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    return (
        <AuthContext.Provider value={{isAuthenticated, userRole, isLoggedIn}}>
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