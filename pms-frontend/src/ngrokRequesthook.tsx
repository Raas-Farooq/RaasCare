import axios from "axios"

interface AxiosFetchParameters{
    method:string,
    url:string,
    data?:object
}
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const makeNgrokRequest = ({url, method='get', data={}}:AxiosFetchParameters) => {
    const headers= { "ngrok-skip-browser-warning":"true"}
    return axios({
         method,
         url:`${backendUrl}/${url}`, 
         data,
         headers
    })
}

export default makeNgrokRequest