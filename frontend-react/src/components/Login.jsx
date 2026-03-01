import React from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import {AuthContext} from '../Authprovider'
import axios from 'axios'
const Login = () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const {isLoggedIn,setIsLoggedIn}=React.useContext(AuthContext)
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const userdata={
            username,password
        }
        try{
          const response=await axios.post("http://localhost:8000/api/v1/token/",userdata)
          localStorage.setItem("access_token",response.data.access)
          localStorage.setItem("refresh_token",response.data.refresh)
        console.log('login successful')
        setIsLoggedIn(true)
        navigate("/")
        }catch (error) {
  console.error("Error logging in:", error);

  const message =
    error.response?.data?.detail ||
    error.response?.data?.message ||
    "Invalid username or password";

  setError(message);
}finally{
            setLoading(false)
        }
    }
  return (
    <>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 bg-light-dark p-5 rounded">
                <h3 className="text-light text-center">Create an Account</h3>
    
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                        />
                       
                  </div>
                 
                 
                  <div className="mb-3">
                    <input
                    type="password"
                    className="form-control"
                    placeholder="Set password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                    
                  </div>
                    <small>{error && <div className="text-danger">{error}</div>}</small>
                  {loading ? (
                    <button className="btn btn-info d-block mx-auto" disabled><FontAwesomeIcon icon={faSpinner} spin/>
                      Logging in...
                    </button>
                  ) :  <button
                    type="submit"
                    className="btn btn-info d-block mx-auto"
                  >
                    Login
                  </button>}
                 
                </form>
    
              </div>
            </div>
          </div>
        </>
  )
}

export default Login