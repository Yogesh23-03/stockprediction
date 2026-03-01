import axios from "axios";

const baseurl=import.meta.env.VITE_BACKEND_BASE_API;
const axiosInstance = axios.create({
    baseURL:baseurl,
    headers:{
        "Content-Type":"application/json"
    }
})

//request interceptors

axiosInstance.interceptors.request.use((config)=>{
    const accesstoken=localStorage.getItem("access_token");
    if(accesstoken){
        config.headers.Authorization=`Bearer ${accesstoken}`;
    }
    return config;
},
(error)=>{
    return Promise.reject(error);
})

//response interceptors
axiosInstance.interceptors.response.use((response)=>{
    return response;
},
//handle failing responses
async (error)=>{
    const originalRequest=error.config;
    if(error.response.status===401 && !originalRequest._retry){
        originalRequest._retry=true;
        const refreshtoken=localStorage.getItem("refresh_token");
        try{
            const response= await axiosInstance.post('/token/refresh',{refresh:refreshtoken})
          
            localStorage.setItem("access_token",response.data.access);
            originalRequest.headers.Authorization=`Bearer ${response.data.access}`;
            return axiosInstance(originalRequest);

        }catch(error){
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href="/login";
            return Promise.reject(error);
        }
       
        
    }
    return Promise.reject(error);
})





export default axiosInstance;