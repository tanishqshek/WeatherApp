import React, { useEffect } from 'react';

const DisplayWeather = ({ weatherData }) => {

  useEffect(() => {
    console.log("Weather state after setting in display: ", weatherData);
}, [weatherData]); 

  // console.log("weatherData: ", weatherData); // Log weatherData
  
  if (!weatherData) {
    return <p>Loading...</p>;
  }

  console.log("city: ", weatherData.city); // Log city
  console.log("temperature: ", weatherData.temperature); // Log temperature
  console.log("description: ", weatherData.description); 
  return (
    <div>
      <h2>Weather for {weatherData.city}</h2>
      {/* <p>Temperature: {weatherData.temperature}°C</p>
      <p>Description: {weatherData.description}</p> */}
    </div>
  );
};

export default DisplayWeather;
