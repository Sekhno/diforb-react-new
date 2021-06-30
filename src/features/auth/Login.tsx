import React, { useState, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter, useHistory, Link } from 'react-router-dom'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { onLogin } from '../../async/authActions'
import styles from './Auth.module.scss'

import { getFirebaseBackend } from '../../helpers/firebase.helper'

const Login = (props: any): JSX.Element => {
  const [ state , setState ] = useState({
    email: '',
    password: ''
  })
  const dispatch = useDispatch()
  // const history = useHistory()
  // const isLogged = useSelector((state: { auth: {isLogged: boolean} }) => state.auth.isLogged)

  // const firebaseBackend = getFirebaseBackend()

  // useEffect(() => {
  //   console.log('use Effect')
  //   if (firebaseBackend?.getAuthenticatedUser() !== null) {
  //     history.push('/dashboard')
  //   }
  // }, [ isLogged ])

  return (
    <div className = { styles.form }>
      <h1 className = 'icon-logo'></h1>
      <h2>Log In</h2>
      <Form>
        <FormGroup>
          <FormGroup className = { styles.group }>
            <Label>Email</Label>
            <Input 
              type = 'email' 
              name = 'email' 
              placeholder = 'type email adress' 
              onChange = {(e) => setState({ ...state, email: e.target.value })}
            ></Input>
          </FormGroup>
          <FormGroup className = { styles.group }> 
            <Label>Password</Label>
            <Input 
              type = 'password' 
              name = 'password' 
              placeholder = 'type password'
              onChange = {(e) => setState({ ...state, password: e.target.value })}
            ></Input>
          </FormGroup>
        </FormGroup>
        <Button 
          className = { styles.button } 
          onClick = { () => dispatch(onLogin(state.email, state.password)) }
        >Login</Button>
        <div className = { styles.links }>
          <Link to = '/signup'>Sign Up</Link>
          <Link to = '/reset'>Forget password</Link>
        </div>
      </Form>
    </div>
  )
}

const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Login))