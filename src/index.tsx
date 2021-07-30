import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserView, MobileView, MobileOnlyView } from 'react-device-detect'
import './index.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store/store'

ReactDOM.render(
  <Provider store = { store }>
    <BrowserView>
      <App />
    </BrowserView>
    <MobileOnlyView>
      Mobile Only!
    </MobileOnlyView>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
