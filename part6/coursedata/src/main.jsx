import { createRoot } from 'react-dom/client'

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import './index.css'
import App from './App.jsx'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
