import './assets/css/style.css'
import Main3 from './components/Main3'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import { Header } from './components/Header'
import Footer from './components/Footer'
import Login from './components/Login'
import Authprovider from './Authprovider'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRouter from './PrivateRoute'
import PublicRoute from './PublicRoute'


function App() {
  return (
    <>
    <Authprovider>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main3 />} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} /> 
        <Route path="/dashboard" element={<PrivateRouter><Dashboard /></PrivateRouter>} />
       
      </Routes>
      <Footer />
    
    </Router>
    </Authprovider>
    </>
  )
}

export default App
