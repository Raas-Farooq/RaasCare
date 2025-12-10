import axios, { type AxiosInstance } from "axios";
import React, { useCallback, useContext, useEffect, useState, type SetStateAction } from "react";

import useFetchAllDoctors from "../features/Doctor/fetchAllDoctors";
import {toast} from "sonner";


interface User {
    username: string,
    id: string,
    email?: string,
    role: string
}
interface PatientHistory
{
    date:string,
    diagnosis:string,
    treatment:string,
}

interface PatientProfile{
    // age:number,
    username?: string,
    _id: string,
    email?: string,
    role: string
    patientName?:string,
    patientId?:string,
    phone?:string,
    dateOfBirth?:string,
    gender?:string,
    city?:string,
    medicalHistory?:PatientHistory[]
}
interface Permissions {
    manage_patients: string,
    view_reports: string,
    manage_doctors: string,
    system_settings: string
}
interface AdminProfile {
    username: string,
    email: string,
    password: string,
    role: string,
    address?: string,
    about?: string,
    permissions: Permissions[]
}
interface BookedSlots {
    doctorId: string,
    slotTime: string,
    isBooked: boolean,
    doctorName:string,
    isCancelled?: boolean,
    source: string,
    slotDate: {
        startDate: Date,
        endDate?: Date
    },
    isCompleted?: boolean,
    patientId?: string,
    patientName: string,
    _id: string,
}
interface AvailableDays {
    day: string,
    slots: [string]

}
interface ProfileImage {
    imageUrl: string,
    public_id: string
}
interface DoctorProfile {
    _id: string,
    username: string,
    email: string,
    password: string,
    education: string,
    speciality: string,
    experience: number,
    about: string,
    available: boolean,
    licenseNumber: string,
    address: string,
    role: string,
    consultationFee: number,
    profileImage: ProfileImage,
    availableDays?: AvailableDays[]
}
interface TimeSlots {
    slotTime: string,
    isBooked: boolean,
    _id?: string,
}
interface ProfileImage {
    imageUrl: string,
    public_id: string
}
interface AllDoctorInterface {
    _id: string,
    username: string,
    email: string,
    password: string,
    profileImage: ProfileImage,
    available:boolean,
    experience:number,
    availableDays:AvailableDays[],
    education: string,
    speciality: string,
    about: string,
    address: string,
    consultationFee: number,
    slots: TimeSlots[]
}
declare global {
    interface Window {
        axios: AxiosInstance
    }
}

interface AuthContextProps {
    bookedSlots: BookedSlots[] | null;
    setBookedSlots: React.Dispatch<React.SetStateAction<BookedSlots[] | null>>;
    user: User | null;
    expiryTime: number | null;
    jwt_token: string | null;
    userRole: string | '';
    adminProfile: AdminProfile | null;
    patientProfile:PatientProfile | null,
    doctorProfile: DoctorProfile | null;
    isAuthenticated: boolean;
    loading: boolean,
    caughtError: string | any,
    loadingAllDoctors:boolean,
    allDoctors:AllDoctorInterface[],
    setAllDoctors:React.Dispatch<React.SetStateAction<AllDoctorInterface[]>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    setUserRole: React.Dispatch<React.SetStateAction<string | ''>>;
    setPatientProfile: React.Dispatch<React.SetStateAction<PatientProfile | null>>;
    setAdminProfile: React.Dispatch<React.SetStateAction<AdminProfile | null>>;
    setDoctorProfile: React.Dispatch<React.SetStateAction<DoctorProfile | null>>;
    login: (user: User, token: string, expiresInSec: number, userProfile: DoctorProfile | AdminProfile, slotsBooked: BookedSlots[]) => void;
    logout: () => void;
    setExpiryTime: React.Dispatch<React.SetStateAction<number | null>>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setJwt_token: React.Dispatch<SetStateAction<string | null>>;

}

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
    const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
    const [allDoctors, setAllDoctors] = useState<AllDoctorInterface[]> ([]);
    const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [bookedSlots, setBookedSlots] = useState<BookedSlots[] | null>(null);
    const [jwt_token, setJwt_token] = useState<string | null>(null);
    const [expiryTime, setExpiryTime] = useState<number | null>(null);
    const [userRole, setUserRole] = useState<string | ''>('');
    const [loading, setLoading] = useState<boolean>(true);
    let logoutTimer: NodeJS.Timeout | undefined;
    const {loadingAllDoctors, doctorsList, caughtError} = useFetchAllDoctors();

      useEffect(() => {
        if(doctorsList.length > 0){
            setAllDoctors(doctorsList);
        }
        if(!loadingAllDoctors && doctorsList.length === 0){
            setAllDoctors(doctorsList);

        }
    },[doctorsList, loadingAllDoctors])

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const logout = useCallback(async () => {
        try {
            await axios.get(`${backend_url}/pms/logout`,
                { withCredentials: true }
            );

        } catch (err) {    
            console.error("Error while clearing Cookie", err)
        }

        toast.dismiss();
        setExpiryTime(null);
        setJwt_token(null);
        setUser(null);
        setUserRole('');
        setIsAuthenticated(false);
        setBookedSlots(null);
        localStorage.removeItem('auth');
        localStorage.removeItem('bookedSlots');
        localStorage.removeItem('profile');
        localStorage.removeItem('ActiveTab');
        if (logoutTimer) {
            clearTimeout(logoutTimer)
        }

    }, []);

    const scheduledLogout = useCallback((exp: number) => {
        
        const timeLeft = exp - Date.now();

        if (timeLeft > 0) {
            logoutTimer = setTimeout(logout, timeLeft)
        } else {
            logout()
        }
    }, [logout])

    function validSlotsFormat(slotsBooked: BookedSlots[]) {
        const parsedBookedSlots = slotsBooked.map((slots) => (
            {
                ...slots,
                slotDate: {
                    startDate: new Date(slots.slotDate.startDate),
                    endDate: slots.slotDate.endDate ? new Date(slots.slotDate.endDate) : undefined,
                }
            }
        ))
        return parsedBookedSlots
    }
    const login = (user: User, token: string, expiresInSec: number, userProfile: DoctorProfile | AdminProfile, slotsBooked: BookedSlots[] | null) => {
        if (user.role === 'doctor') {
            setDoctorProfile(userProfile as DoctorProfile);
            localStorage.setItem('profile', JSON.stringify(userProfile));
        }
        if (user.role === 'admin') {
            setAdminProfile(userProfile as AdminProfile);
            localStorage.setItem('profile', JSON.stringify(userProfile));
        } 
        if (user.role === 'patient') {
            setPatientProfile(userProfile as PatientProfile);
            localStorage.setItem('profile', JSON.stringify(userProfile));
        } 
        if(user.role){
            if (slotsBooked && slotsBooked.length) {
                localStorage.setItem("bookedSlots", JSON.stringify(slotsBooked));
                const updatedFormat = validSlotsFormat(slotsBooked)
                setBookedSlots(updatedFormat);
            }
        }
        
        setUser(user);
        setJwt_token(token);
        setUserRole(user.role);
        setIsAuthenticated(true);
        const expiryInSeconds = Date.now() + expiresInSec * 1000;
        setExpiryTime(expiryInSeconds);
        localStorage.setItem('auth', JSON.stringify({
            user: user,
            jwt_token: token,
            expiryTime: expiryInSeconds,
            userRole: user.role,
            isAuthenticated: true
        })
        )
        scheduledLogout(expiryInSeconds)
    }

    useEffect(() => {
        const localSavedData = localStorage.getItem('auth');
        if (localSavedData) {
            const { user, expiryTime, jwt_token, userRole, isAuthenticated } = JSON.parse(localSavedData);
                const localStoredProfile = localStorage.getItem('profile');
                if (localStoredProfile) {
                    try {
                        const profile = JSON.parse(localStoredProfile);
                        if(userRole === 'doctor'){
                            setDoctorProfile(profile);
                        }else if(userRole === 'admin'){
                            setAdminProfile(profile)
                        }
                        else if(userRole === 'patient'){
                            setPatientProfile(profile)
                        }
                        
                    }
                    catch (err) {
                        console.error('Error while parsing Doctor Profile ', err);
                    }
                }
                const localBookedSlots = localStorage.getItem('bookedSlots');
                if (localBookedSlots) {
                    try {
                        const parsedSlots = JSON.parse(localBookedSlots);
                        const updateSlotsFormat = validSlotsFormat(parsedSlots)
                        setBookedSlots(updateSlotsFormat);
                    }
                    catch (err) {
                        console.error('error while parsing doctor booked slots', err);
                    }
                }
            
            if (Date.now() < expiryTime) {
                setUser(user);
                setJwt_token(jwt_token);
                setExpiryTime(expiryTime);
                setUserRole(userRole);
                setIsAuthenticated(isAuthenticated);
                scheduledLogout(expiryTime);
            } else {
                logout();
            }
        } else {
            logout();
        }

        setLoading(false);

    }, [logout, scheduledLogout])

    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        const axiosInstance = axios.create({
            baseURL: baseUrl,
    
            withCredentials: true
        })

        axiosInstance.interceptors.request.use((config) => {
            if (jwt_token) {
                config.headers.Authorization = `Bearer ${jwt_token}`
            }
            return config;
        })

        axiosInstance.interceptors.response.use((res) => res,
            (err) => {
                if (err.response?.status === 401) {
                    logout()
                }
                return Promise.reject(err);
            })
    }, [jwt_token, logout])



    return (
        <AuthContext.Provider value={{ patientProfile, setPatientProfile,allDoctors,loadingAllDoctors,caughtError, setAllDoctors, bookedSlots, setBookedSlots, adminProfile, setAdminProfile, doctorProfile, setDoctorProfile, loading, setLoading, isAuthenticated, setIsAuthenticated, user, setUserRole, userRole, jwt_token, expiryTime, login, logout, setUser, setExpiryTime, setJwt_token }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('AuthenContext can only use within AuthenContext Provider')
    }

    return context
}

