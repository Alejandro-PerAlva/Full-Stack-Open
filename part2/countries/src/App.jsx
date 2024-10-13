import { useState, useEffect } from 'react'

const App = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY

  useEffect(() => {
    if (searchQuery === '') {
      setCountries([])
      return
    }

    const fetchCountries = async () => {
      setLoading(true)
      setError(null)
      console.log(`Fetching countries for query: ${searchQuery}`)

      try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${searchQuery}`)
        const data = await response.json()

        console.log('Data received from API:', data)

        if (data.status === 404 || data.length === 0) {
          setCountries([])
          console.log('No countries found for this query.')
        } else {
          setCountries(data)
          console.log(`Found ${data.length} countries.`)
        }
      } catch (err) {
        setError('There was an error fetching the data.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
        console.log('Data fetch completed.')
      }
    }

    fetchCountries()
  }, [searchQuery])

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value)
    console.log('Search query updated:', event.target.value)
  }

  const handleShowDetails = async (country) => {
    setSelectedCountry(country)
    console.log(`Details for ${selectedCountry} selected`)

    // Obtener el clima si la capital está disponible
    if (country.capital && country.capital.length > 0) {
      const capital = country.capital[0]
      await fetchWeatherData(capital)
    }
  }

  const fetchWeatherData = async (capital) => {
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric&lang=en`
      )
      const weatherData = await weatherResponse.json()
      console.log('Weather data received:', weatherData)

      if (weatherData.cod === 200) {
        setWeather(weatherData)
      } else {
        setWeather(null)
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
      setWeather(null)
    }
  }

  const renderCountries = () => {
    console.log('Rendering countries...')

    if (loading) {
      return <p>Loading...</p>
    }

    if (error) {
      return <p>{error}</p>
    }

    if (countries.length === 0) {
      return <p>No countries found.</p>
    }

    if (countries.length > 10) {
      return <p>Too many results. Please make your search more specific.</p>
    }

    if (countries.length > 1) {
      console.log(`Displaying ${countries.length} countries.`)
      return (
        <div className="country-list">
          {countries.map((country) => {
            const flagUrl = country.flags[0] || country.flags.png || country.flags.svg
            console.log(`Country flag URL: ${flagUrl}`)
            return (
              <div key={country.cca3} className="country-item">
                <p>{country.name.common}</p>
                <button onClick={() => handleShowDetails(country)}>Show Details</button>
                <img src={flagUrl} alt={country.name.common} width="50" />
              </div>
            )
          })}
        </div>
      )
    }

    const country = countries[0]
    const flagUrl = country.flags[0] || country.flags.png || country.flags.svg
    console.log(`Displaying details for country: ${country.name.common}`)
    console.log(`Country flag URL: ${flagUrl}`)
    return (
      <div className="country-detail">
        <h2>{country.name.common}</h2>
        <img src={flagUrl} alt={country.name.common} />
        <p><strong>Capital:</strong> {country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Area:</strong> {country.area} km²</p>
        <p><strong>Languages:</strong> {Object.values(country.languages).join(', ')}</p>

        {weather ? (
          <div className="weather-info">
            <h3>Weather in {country.capital[0]}</h3>
            <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
            <p><strong>Weather:</strong> {weather.weather[0].description}</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
            />
          </div>
        ) : (
          <p>Weather data not available</p>
        )}
      </div>
    )
  }

  return (
    <div className="App">
      <h1>Search for Countries</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Enter country name..."
      />
      <div className="result-container">{renderCountries()}</div>
    </div>
  )
}

export default App
