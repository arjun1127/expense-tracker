import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance=axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers:{
        'Content-Type':'application/json',
        Accept:'application/json'
    }
});
axiosInstance.interceptors.request.use((config)=>{
    const token=localStorage.getItem('token');
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
},(error)=>{
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use((response)=>{
    return response;
},(error)=>{
    if(error.response && error.response.status===401){
        localStorage.removeItem('token');
        window.location.href='/login';
    }else if(error.response.status===500){
        console.error("Server Error: ", error.response.data.message);
    }else if(error.response.status===400){
        console.error("Bad Request: ", error.response.data.message);
    }else if(error.code==='ECONNABORTED'){
        console.error("Request Timeout: ", error.message);
    }
    else{
        console.error("Error: ", error.message);
    }
    return Promise.reject(error);
});

export default axiosInstance;