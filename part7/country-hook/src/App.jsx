import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Hook personalizado para gestionar campos de entrada
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

// Hook personalizado para buscar detalles del país
const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) {
      setCountry(null)
      return
    }

    const fetchCountry = async () => {
      try {
        const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        setCountry({
          found: true,
          data: response.data
        })
      } catch (error) {
        setCountry({ found: false })
      }
    }

    fetchCountry()
  }, [name]) // Ejecutar efecto solo cuando 'name' cambie

  return country
}

// Componente para mostrar detalles del país
const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  const { name, capital, population, flags } = country.data

  return (
    <div>
      <h3>{name.common}</h3>
      <div>capital {capital}</div>
      <div>population {population}</div>
      <img src={flags.svg} height="100" alt={`flag of ${name.common}`} />
    </div>
  )
}

// Componente principal de la aplicación
const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
