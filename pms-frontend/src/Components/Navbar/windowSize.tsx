import { debounce } from "lodash"
import { useEffect, useState } from "react"


const useWindowSize = () => {

    const [width, setWidth] = useState({
        width:window.innerWidth
    })
     const sizeChange = debounce(() => {
        setWidth({
            width:window.innerWidth
        })
    }, 0)
    
    useEffect(() =>{
        window.addEventListener('resize', sizeChange);
        sizeChange();

        return () => {
            window.removeEventListener('resize', sizeChange)
        }
    },[])

    return width
}

export default useWindowSize


