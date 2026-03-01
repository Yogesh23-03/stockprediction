import React,{useEffect,useState} from 'react'
import axios from 'axios'
import axiosInstance from '../../axiosInstance'
const Dashboard = () => {
    useEffect(() => {
        const fetchProtectedData = async () => {
            try{
                const response = await axiosInstance.get("/protected-view")
                console.log(response.data);
                console.log('Success')
            }catch(error){
                console.log(error);
            }
        }
        fetchProtectedData()
    },[])
  return (
    <div className='text-light container'>Dashboard</div>
  )
}

export default Dashboard