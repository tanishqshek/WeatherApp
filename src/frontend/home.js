import React, { useState } from 'react';
import DisplayWeather from './DisplayWeatherComponent';

const Home = () => {
    const [cityName, setCityName] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitEvent = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:6000/api/weather?city=${city}`);

            if(!response.ok) {
                throw new Error('Unable to fetch city');
            }

            const data = await response.json();
            setWeather(data);

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleInputChange = async (event) => {
        setCityName(event.target.value);
    }

    return React.createElement(
        'div',
        null,
        React.createElement('form', { onSubmit: handleSubmitEvent }, [
            React.createElement('input', {
                type: 'text',
                placeholder: 'Enter name of the city',
                value: cityName,
                onChange: handleInputChange,
            }),
            React.createElement('button', { type: 'submit' }, 'Display Weather'),
        ]),

        isLoading && React.createElement('h3', null, 'Loading...'),
        error && React.createElement('h3', null, error),
        weather && React.createElement(DisplayWeather, { weather: weather })
    );
};

export default Home;