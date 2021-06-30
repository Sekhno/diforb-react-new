import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { withRouter, Link  } from 'react-router-dom'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { onSignin } from '../../async/authActions'
import styles from './Auth.module.scss'

const Signup = (): JSX.Element => {
  const [ state , setState ] = useState({
    email: '',
    password: ''
  })
  const dispatch = useDispatch()

  return (
    <div className = { styles.form }>
      <h1 className = 'icon-logo'></h1>
      <h2>Sign Up</h2>
      <Form>
        <FormGroup>
          <FormGroup className = { styles.group }>
            <Label> Email </Label>
            <Input 
              type = 'email' 
              name = 'email' 
              placeholder = 'type email adress' 
              onChange = {(e) => setState({ ...state, email: e.target.value })}
            ></Input>
          </FormGroup>
          <FormGroup className = { styles.group }> 
            <Label> Password </Label>
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
          onClick = {() => dispatch(onSignin(state.email, state.password))}
        > Sign Up </Button>
        <div className = { styles.links }>
          <Link to = '/login'> Log In </Link>
        </div>
      </Form>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  console.log('State', state)
  return { }
}

export default withRouter(connect(mapStateToProps)(Signup))