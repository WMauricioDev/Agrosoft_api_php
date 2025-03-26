import React, { useState, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import {  WiSunrise, WiSunset, WiHumidity, WiStrongWind } from "react-icons/wi";

interface WeatherData {
  coord: { lon: number; lat: number };
  weather: { id: number; main: string; description: string; icon: string }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number };
  clouds: { all: number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

const Dashboard: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Pitalito&appid=1912de4d8f25e4b41824e3920aed0598&units=metric&lang=es`)
      .then((response) => response.json())
      .then((data) => setWeather(data));
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Panel Principal</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
          <div className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Programaciones</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Riego automático - 6:00 AM</li>
              <li>Revisión de bancales - 10:00 AM</li>
            </ul>
          </div>

          <div className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Clima en Pitalito</h2>
            {weather ? (
              <div className="text-gray-700 space-y-3">
                <p><strong>Temperatura:</strong> {Math.round(weather.main.temp)}°C</p>
                <p><strong>Humedad:</strong> {weather.main.humidity}%</p>
                <p><strong>Condición:</strong> {weather.weather[0].description}</p>
                <p className="text-sm text-gray-600">Última actualización: {new Date().toLocaleTimeString()}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <WiHumidity className="text-4xl text-blue-500" />
                    <p>{weather.main.humidity}%</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <WiStrongWind className="text-4xl text-green-500" />
                    <p>{weather.wind.speed} m/s</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <WiSunrise className="text-4xl text-orange-500" />
                    <p>{new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <WiSunset className="text-4xl text-purple-500" />
                    <p>{new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Cargando...</p>
            )}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default Dashboard;