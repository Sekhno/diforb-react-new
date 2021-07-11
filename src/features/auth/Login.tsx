import React, { useState, useRef }      from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter, Link }     from 'react-router-dom'
import { Password }             from 'primereact/password'
import { InputText }            from 'primereact/inputtext'
import { Button }               from 'primereact/button'
import { onLogin, onLoginWithSocial } from '../../async/authActions'
import { resetError }           from './authSlice'
import styles                   from './Auth.module.scss'

import { getFirebaseBackend } from '../../helpers/firebase.helper'

const Login = (props: any): JSX.Element => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const dispatch = useDispatch()
  const error = useSelector((state: { auth: { error: string } }) => state.auth.error)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  return (
    <div className = { styles.wrapper + ' card' }>
      <h1 className = 'icon-logo'></h1>
      <h2>Log In</h2>
      <div className = 'p-grid p-fluid'>
        <div className = 'p-col-12 p-md-12'>
          <div className = { styles.group }>
            <label>Email</label>
            <div className='p-inputgroup'>
              <InputText 
                ref = { emailRef }
                className = { styles.input } placeholder = 'Type email adress' 
                onChange={(e) => setEmail(e.target.value)}
                onFocus = {(e) => error && dispatch(resetError())}
              />
            </div>
          </div>
          <div className = { styles.group }>
            <label>Password</label>
            <div className='p-inputgroup'>
              <Password  
                ref = { passwordRef }
                className = { styles.input }
                value = { password }  placeholder = 'Password' 
                onChange={(e) => setPassword(e.target.value)} 
                onFocus = {(e) => error && dispatch(resetError())}
              />
            </div>
          </div>
          <p className = { styles.error }>{ error }</p>
          <Button 
            className = {styles.button} label = 'Login' loading = {false} icon = 'icon-login'
            onClick = { () => dispatch(onLogin(email, password)) }
          />
          <Button 
            className = {styles.button} label = 'Login with Google' loading = {false} icon = 'icon-google'
            onClick = { () => dispatch(onLoginWithSocial('google')) }
          />
          <Button 
            className = {styles.button} label = 'Login with Facebook' loading = {false} icon = 'icon-facebook'
            onClick = { () => dispatch(onLoginWithSocial('facebook')) }
          />
          <div className = { styles.links }>
            <Link to = '/signup'>
              <Button label = 'Sign Up' className = { styles.link + ' p-button-link' } />
            </Link>
            <Link to = '/reset'>
              <Button label = 'Forget password' className = { styles.link + ' p-button-link' } />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Login))
