import React from "react";
import Button from "./Button";

export const Header = () => {
  return (
    
    <>
    <nav className="navbar container pt-3 pb-3 align-items-start">
      <a href="" className="navbar-brand text-light">Stock Prediction Portal</a>
      <div>
        <Button/>
        &nbsp;
        <a href="" className="btn btn-info">Register</a>
      </div>
    </nav>
    </>
  );
};
