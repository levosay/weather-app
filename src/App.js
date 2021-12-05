import React, {useRef, useState} from 'react'
import {fetchTemplate} from './utils/fetchTemplate'
import './App.css'
import snow from './img/snow.svg'
import cloud from './img/cloud.svg'
import rain from './img/rain.svg'
import sun from './img/sun.svg'
import mist from './img/mist.svg'
import save from './img/save.png'
import saveClose from './img/save-close.png'

const API_KEY = '94b47b9cb1f4907cd5dc40e919a25c3b'

const App = () => {

  const [state, setState] = useState([])
  const [error, setError] = useState('')
  const inputValue = useRef(null)


  const findCity = city => {

    fetchTemplate(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
      .then(data => {
        if (data.cod === 200) {
          setError('')
          setState(data)
        } else {
          setState('')
          setError(data.message)
          console.error(`ERROR: ${data.message} ${data.cod}`)
        }
      }).finally(inputValue.current.value = null)

  }

  const convertTemp = kelvin => {
    return Math.round(Number(kelvin - 273))
  }

  const settings = {
    snow: `${snow}`,
    rain: `${rain}`,
    sun: `${sun}`,
    clouds: `${cloud}`,
    clear: `${sun}`,
    mist: `${mist}`
  }

  const createIcon = (weather) => {
    switch (weather) {
      case 'Snow': return <img className="icon__img" src={settings.snow} alt="snow"/>
      case 'Clouds': return <img className="icon__img" src={settings.clouds} alt="clouds"/>
      case 'Rain': return <img className="icon__img" src={settings.rain} alt="rain"/>
      case 'Clear': return <img className="icon__img" src={settings.clear} alt="clear"/>
      case 'Mist': return <img className="icon__img" src={settings.mist} alt="mist"/>
    }
  }

  const saveCity = () => {
    console.log('save ', state.name)

  }


  console.log(state)

  return (
    <div className="App">
      <div className="container">

        <div className="searching-wrapper">
          <div className="searching">
            <input
              className="searching__input"
              type="text"
              placeholder="Search..."
              ref={inputValue}
            />
            <button
              className="searching__btn"
              onClick={() => findCity(inputValue.current.value)}
            >
              find
            </button>
          </div>
          <img
            src={save} alt="save"
            className="searching-wrapper__save-btn"
            onClick={saveCity}
          />
        </div>
        {state && state.main ?
          <div className="info">
            <div className="info-title-wrapper">
              <h1 className="info__title">{state.name}</h1>
              <span className="info__temperature">{convertTemp(state.main.temp)}ºC</span>
            </div>
            {state.weather.map(item => (
              <div key={item.id} className="icon">
                {createIcon(item.main)}
                <span className="icon__description">{item.description}</span>
              </div>
            ))}
          </div>
          :
          <h1>{error === 'Nothing to geocode' ? 'enter city' : error}</h1>}
        <div className="more-info">
          <h3 className="more-info__title">coordinate</h3>
          <span className="more-info__description">width: {state.coord ? state.coord.lat : ''}</span>
          <span className="more-info__description">longitude: {state.coord ? state.coord.lon : ''}</span>


        </div>
      </div>
    </div>
  )
}

export default App
