import React, { useState, useEffect, useRef } from 'react'
import { connect, useDispatch, useSelector  } from 'react-redux'
import { withRouter, Link  } from 'react-router-dom'
import { InputText }            from 'primereact/inputtext'
import { Button }               from 'primereact/button'
import { onResetPassword }      from '../../async/authActions'
import { resetError }           from './authSlice'
import styles from './Auth.module.scss'

const Reset = (): JSX.Element => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ message, setMesssage ] = useState('')
  const error = useSelector((state: { auth: { error: string } }) => state.auth.error)
  const emailRef = useRef(null)
  const isResetedPassword = useSelector((state: { auth: {isResetedPassword: boolean} }) => state.auth.isResetedPassword)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isResetedPassword) {
      setMesssage('Hello People! Check your email! folow link.')
    }
  }, [ isResetedPassword ])

  return (
    <div className = { styles.wrapper + ' card' }>
      <h1 className = 'icon-logo'></h1>
      <h2>Reset Password</h2>
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
          <p className = { styles.message }>{ message }</p>
          <p className = { styles.error }>{ error }</p>
          <Button 
            className = {styles.button} label = 'Login' loading = {false}
            onClick = { () => dispatch(onResetPassword(email)) }
          />
          
          <div className = { styles.links }>
            <Link to = '/login'>
              <Button label = 'Log In' className = { styles.link + ' p-button-link' } />
            </Link>
            <Link to = '/signup'>
              <Button label = 'Sign Up' className = { styles.link + ' p-button-link' } />
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

export default withRouter(connect(mapStateToProps)(Reset))