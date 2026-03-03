from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import StockPredictionSerializer
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import os
from django.conf import settings
from .utils import save_plot
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Create your views here.


class StockPredictionView(APIView):
    def post(self, request):
        serializer = StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']
            now=datetime.now()
            start=datetime(now.year-10,now.month,now.day)
            end=now
            df=yf.download(ticker,start=start,end=end)
            if df.empty:
                    return Response(
                    {"error": "Invalid ticker symbol or no data found"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            print(df)
            df=df.reset_index()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df.Close,label="Closing Price")
            plt.title(f'closing price of{ticker}')
            plt.xlabel('Days')
            plt.ylabel('close price')
            plt.legend()
            plot_img_path=f'{ticker}_plot.png'
           
            plot_img=save_plot(plot_img_path)
            print(plot_img)
            plt.close()

            #100 days moving average
            ma100=df.Close.rolling(100).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df.Close,label="Closing Price")
            plt.plot(ma100,label="100 days moving average")
            plt.title(f'100 days moving average of{ticker}')
            plt.xlabel('Days')
            plt.ylabel('Price')
            plt.legend()
            plot_img_path=f'{ticker}_100_ma_plot.png'
            plot_100ma_img=save_plot(plot_img_path)
           #200 days moving average
            ma200=df.Close.rolling(200).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df.Close,label="Closing Price")
            plt.plot(ma100,'r',label="100 days moving average")
            plt.plot(ma200,'g',label="200 days moving average")
            plt.title(f'100 days moving average of{ticker}')
            plt.xlabel('Days')
            plt.ylabel('Price')
            plt.legend()
            plot_img_path=f'{ticker}_200_ma_plot.png'
            plot_200ma_img=save_plot(plot_img_path)
            

            #splitting dat
            data_training = pd.DataFrame(df.Close[0:int(len(df) * 0.7)])
            data_testing=pd.DataFrame(df.Close[int(len(df)*0.7):int(len(df))])
            #scaling od data 
            scaler=MinMaxScaler(feature_range=(0,1))
            #loading model
            model_path = os.path.join(settings.BASE_DIR, 'stock_prediction_model.keras')
            print("Model path:", model_path)   # Add this for debugging
            model = load_model(model_path)
            #prepare test data
            past_100_days=data_training.tail(100)
            final_df = pd.concat([past_100_days, data_testing], ignore_index=True)
            input_data=scaler.fit_transform(final_df)
            x_test=[]
            y_test=[]
            for i in range(100,input_data.shape[0]):
                x_test.append(input_data[i-100:i])
                y_test.append(input_data[i,0])
            x_test,y_test=np.array(x_test),np.array(y_test)
            #making predictions
            y_predicted=model.predict(x_test)
            #revert scaled prices
            y_test=scaler.inverse_transform(y_test.reshape(-1,1)).flatten()
            y_predicted=scaler.inverse_transform(y_predicted.reshape(-1,1)).flatten()

            #plot the final prediction
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(y_test,'b',label="Original Price")
            plt.plot(y_predicted,'r',label="Predicted Price")
            plt.title(f'final prediction for {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Price')
            plt.legend()
            plot_img_path=f'{ticker}_200_ma_plot.png'
            plot_final_img=save_plot(plot_img_path)
           
            #mse
            mse=mean_squared_error(y_test,y_predicted)
            #r2
            r2=r2_score(y_test,y_predicted)
            #rmse
            rmse=np.sqrt(mean_squared_error(y_test,y_predicted))


            return Response({"ticker": ticker, "prediction": "Prediction logic not implemented",'plot_img':plot_img,'plot_100ma_img':plot_100ma_img,'plot_200ma_img':plot_200ma_img,'plot_final_img':plot_final_img
                             ,'mse':mse,'r2':r2,'rmse':rmse}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
