import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom"


export default function useScrollRestore(){

    const {key} = useLocation();

    useLayoutEffect(() => {
        // console.log("pathname: ",pathname);

        const savedPosition = sessionStorage.getItem(key);

        if(savedPosition){
            window.scrollTo(0, Number(savedPosition));
        }

        return () => {
            sessionStorage.setItem(key, String(window.scrollY));
        }

    },[key])
}


