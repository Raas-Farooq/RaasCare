import axios from "axios"

interface AxiosFetchParameters{
    method:string,
    url:string,
    data?:object
}
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const makeRequest = ({url, method='get', data={}}:AxiosFetchParameters) => {

    return axios({
         method,
         url:`${backendUrl}/${url}`, 
         data,
    })
}

export default makeRequest

