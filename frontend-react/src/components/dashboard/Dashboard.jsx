import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
const Dashboard = () => {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [error , setError] = useState(null)
    const [plot,setPlot]=useState()
    const [ma100,setMa100]=useState()
    const [ma200,setMa200]=useState()
    const [final,setFinal]=useState()
    const [mse,setMSE]=useState()
    const [rmse,setRMSE]=useState()
    const [r2,setR2]=useState()
    const [hasResult, setHasResult] = useState(false)
  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await axiosInstance.get("/protected-view");
        console.log('Auth Success:', response.data);
        if(response.data.error){
            setError(response.data.error)
        }
      } catch (error) {
        console.log('Auth Error:', error);
      }
    };
    fetchProtectedData();
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);   // clear old error

  try {
    const response = await axiosInstance.post('/predict/', {
      ticker: ticker
    });

    console.log(response);
    const backendRoot=import.meta.env.VITE_BACKEND_ROOT
    const plotUrl=`${backendRoot}${response.data.plot_img}`
    const ma100Url=`${backendRoot}${response.data.plot_100ma_img}`
    const ma200Url=`${backendRoot}${response.data.plot_200ma_img}`
    const finalUrl=`${backendRoot}${response.data.plot_final_img}`
    setMSE(response.data.mse)
    setRMSE(response.data.rmse)
    setR2(response.data.r2)
    setFinal(finalUrl)
    setPlot(plotUrl)
    setMa100(ma100Url)
    setMa200(ma200Url)
    console.log(plotUrl)
    setHasResult(true)
  } catch (error) {

    if (error.response && error.response.data) {
      setError(error.response.data.error);
    } else {
      setError("Something went wrong. Try again.");
    }
    setHasResult(false)

  }

  setLoading(false);
};

  return (
   <div className='container' style={{ marginTop: '100px' }}>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            className='form-control' 
                            placeholder='Enter Stock Ticker'
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value)} 
                            required 
                        />
                        <small className='text-danger'>{error}</small>
                        <button type='submit' className='btn btn-info mt-3'>
                        {loading ? <span><FontAwesomeIcon icon={faSpinner} spin /> Please wait...</span> : 'Predict'}
                        </button>
                    </form>
                </div>
                {
                  hasResult &&                <div className='prediction mt-5'>
    <div className='p-3'>
        {plot && (
            <img src={plot} alt="Stock Plot" className="img-fluid" />
        )}
    </div>
     <div className='p-3'>
        {ma100 && (
            <img src={ma100} alt="Stock Plot" className="img-fluid" />
        )}
    </div>
    <div className='p-3'>
        {ma200 && (
            <img src={ma200} alt="Stock Plot" className="img-fluid" />
        )}
    </div>
    <div className='p-3'>
        {final && (
            <img src={final} alt="Stock Plot" className="img-fluid" />
        )}
    </div>
    <div className="text-light p-3">
      <h4>Model Evaluation</h4>
      <p>Mean Squared Error: {mse}</p>
      <p>Root Mean Squared Error: {rmse}</p>
      <p>R-squared: {r2}</p>
    </div>
</div>
                }

            </div>
        </div>
  );
};

export default Dashboard;