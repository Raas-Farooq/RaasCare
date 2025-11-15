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

// Access to XMLHttpRequest at 'https://b50f8246d0d1.ngrok-free.app/pms/logout' from origin 'http://localhost:5173' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.Understand this error
// appContext.tsx:186 Error while clearing Cookie AxiosError {message: 'Network Error', name: 'AxiosError', code: 'ERR_NETWORK', config: {…}, request: XMLHttpRequest, …}
// overrideMethod @ hook.js:608
// (anonymous) @ appContext.tsx:186Understand this error
// appContext.tsx:181  GET https://b50f8246d0d1.ngrok-free.app/pms/logout net::ERR_FAILED 200 (OK)
// dispatchXhrRequest @ axios.js?v=13d7d435:1648
// xhr @ axios.js?v=13d7d435:1528
// dispatchRequest @ axios.js?v=13d7d435:2003
// _request @ axios.js?v=13d7d435:2224
// request @ axios.js?v=13d7d435:2115
// Axios.<computed> @ axios.js?v=13d7d435:2243
// wrap @ axios.js?v=13d7d435:8
// (anonymous) @ appContext.tsx:181Understand this error
