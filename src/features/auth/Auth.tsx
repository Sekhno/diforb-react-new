import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { login, logout } from './authSlice'
import styles from './Auth.module.scss'

const Auth = (): JSX.Element =>  {
  const isLogged = useSelector((state: { auth: {isLogged: boolean} }) => state.auth.isLogged)
  const dispatch = useDispatch()

  return (
    <div className = { styles.wrapper }>
      <div>{ isLogged + '' }</div>
      {/* <button onClick = {() => dispatch(login())}> Login </button>
      <button onClick = {() => dispatch(logout())}> Logout </button> */}
    </div>
  )
}

export default Auth