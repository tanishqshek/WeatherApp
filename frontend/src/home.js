import React, {
    useState
} from 'react';
import './home.css';

const Home = () => {
        const [cityName, setCityName] = useState('');
        const [weather, setWeather] = useState('');
        const [error, setError] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [dataLoaded, setDataLoaded] = useState(false);

        const handleSubmitEvent = async (event) => {
            setDataLoaded(false);
            event.preventDefault();
            setIsLoading(true);
            setError('');

            try {
                const response = await fetch(`https://weatherbackendserver.onrender.com/api/weather?cityName=${cityName}`);

                const data = await response.json();
                setWeather(data);
                setDataLoaded(true);

            } catch (error) {
                console.log(JSON.stringify(error));
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        const handleInputChange = (event) => {
            setCityName(event.target.value);
        }

        return (
            <div className="weather-container">
              <h1>Weather Data</h1>
              <input
                className="city-input"
                type="text"
                placeholder="Enter city name"
                value={cityName}
                onChange={handleInputChange} />
              <button className="get-weather-btn" onClick={handleSubmitEvent}>Get Weather</button>
              <br />
              {error && <p className="error-msg">{error}</p>}
              {isLoading ? (
                <h2>Loading...</h2>
              ) : dataLoaded && weather ? (
                <div className="weather-info">
                  <h2>City: {weather.city}</h2>
                  <h2>Temperature: {weather.temperature}°C</h2>
                  <h2>Description: {weather.description}</h2>
                </div>
              ) : null}
            </div>
          );
          
        
        };

export default Home;

