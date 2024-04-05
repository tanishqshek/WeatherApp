import React from 'react';

const DisplayWeather = ({ weatherData }) => {
  return React.createElement(
    'div',
    null,
    React.createElement('h2', null, `Weather for ${weatherData.city}`),
    React.createElement('p', null, `Temperature: ${weatherData.temperature}°C`),
    React.createElement('p', null, `Description: ${weatherData.description}`)
    // Add more weather details here
  );
};

export default DisplayWeather;
