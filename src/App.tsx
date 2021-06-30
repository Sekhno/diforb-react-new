import React, { useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { authProtectedRoutes, publicRoutes } from './routes'
import './App.scss'
// import Auth from './features/auth/Auth'
import AppRoute from './routes/route'
import NonAuthLayout from './components/NonAuthLayout'
import Layout from './components/Layout'
import { initFirebaseBackend, getFirebaseBackend } from './helpers/firebase.helper'
import { login } from './features/auth/authSlice'

const firebaseConfig = {
  apiKey: "AIzaSyBG8znM0AFK8v3yMScWoiwPzPWgCcA-LnY",
  authDomain: "diforb-react-1ec55.firebaseapp.com",
  projectId: "diforb-react-1ec55",
  storageBucket: "diforb-react-1ec55.appspot.com",
  messagingSenderId: "998910724069",
  appId: "1:998910724069:web:6b1e390b94b84921fe910c",
  measurementId: "G-FK6LNR554Z"
}

const firebaseBackend = initFirebaseBackend(firebaseConfig)

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (firebaseBackend?.getAuthenticatedUser() !== null) {
      dispatch(login())
    }
  }, [])

  return (
    <React.Fragment>
      <Router>
        <Switch>
          
          {
            publicRoutes.map((route, idx) => (
              <AppRoute
                path = { route.path }
                layout = { NonAuthLayout }
                component = { route.component }
                key = { idx }
                isAuthProtected = { false }
              />
            ))
          }

          { 
            authProtectedRoutes.map((route, idx) => (
              <AppRoute
                path = { route.path }
                layout = { Layout }
                component = { route.component }
                key = { idx }
                isAuthProtected = { true }
                exact
              />
            )) 
          }
        </Switch>
      </Router>
    </React.Fragment>
  )
}

const mapStateToProps = (state: any) => {
  return {}
}

export default connect(mapStateToProps, null)(App)
