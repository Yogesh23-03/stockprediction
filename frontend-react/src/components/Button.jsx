import React, { useContext } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { AuthContext } from "../Authprovider";

const Button = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <>
      {isLoggedIn ? (
        <span
          className="btn btn-outline-info"
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setIsLoggedIn(false);
            navigate("/login");
          }}
        >
          Logout
        </span>
      ) : (
        <Link to="/login" className="btn btn-outline-info">
          Login
        </Link>
      )}
    </>
  );
};

export default Button;