import React from 'react'
import { useState ,useContext} from 'react'

const AuthContext = React.createContext();

const Authprovider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      {children}
    </AuthContext.Provider>
  )
}

export default Authprovider
export {AuthContext};