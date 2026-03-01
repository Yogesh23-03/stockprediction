import React, { useContext } from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import { AuthContext } from "../Authprovider";

const Main3 = () => {
const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  return (
    
    <>
    
    <div className="container">
        <div className="p-5 text-center bg-light-dark rounded">
            <h1 className="text-light">Stock prediction portal</h1>
            <p className="text-light lead">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure eligendi dolorum eos eveniet qui hic atque debitis, assumenda consequatur cumque perferendis quas aspernatur. Reiciendis numquam id cupiditate quisquam illo odit laudantium ipsa doloribus sit perferendis.</p>
           {isLoggedIn ? (<Link to="/dashboard" className="btn btn-outline-info">
          Explore Now
        </Link>) : (<Link to="/login" className="btn btn-outline-info">
          login
        </Link>)}
           
        </div>
    </div>
     
    </>
  );
};

export default Main3;
