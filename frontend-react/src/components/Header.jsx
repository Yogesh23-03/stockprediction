import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Authprovider";
export const Header = () => {
  const { isLoggedIn ,setIsLoggedIn} = React.useContext(AuthContext);
  return (
    
    <>
    <nav className="navbar container pt-3 pb-3 align-items-start">
      <Link to="/login" className="navbar-brand text-light">Stock Prediction Portal</Link>
      <div>
        <Button/>
        &nbsp;
        <Link to="/register" className="btn btn-info">Register</Link>
      </div>
    </nav>
    </>
  );
};
