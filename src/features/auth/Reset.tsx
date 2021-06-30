import React, { useState, useEffect } from 'react'
import { connect, useDispatch, useSelector  } from 'react-redux'
import { withRouter, Link  } from 'react-router-dom'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { onResetPassword } from '../../async/authActions'
import styles from './Auth.module.scss'

const Reset = (): JSX.Element => {
  const [ email , setEmail ] = useState('')
  const [ message, setMesssage ] = useState('')
  const dispatch = useDispatch()
  const isResetedPassword = useSelector((state: { auth: {isResetedPassword: boolean} }) => state.auth.isResetedPassword)

  useEffect(() => {
    if (isResetedPassword) {
      setMesssage('Hello People! Check your email! folow link.')
    }
  }, [ isResetedPassword ])

  return (
    <div className = { styles.form }>
      <h1 className = 'icon-logo'></h1>
      <h2>Reset Password</h2>
      <Form>
        {
          message ? 
          <div>{ message }</div> :
          <React.Fragment>
            <FormGroup>
              <FormGroup className = { styles.group }>
                <Label> Email </Label>
                <Input 
                  type = 'email' 
                  name = 'email' 
                  placeholder = 'type email adress' 
                  onChange = {(e) => setEmail(e.target.value)}
                ></Input>
              </FormGroup>
            </FormGroup>
            <Button 
              className = { styles.button } 
              onClick = {() => dispatch(onResetPassword(email))}
            > Reset Password </Button>
          </React.Fragment>
        }
        <div className = { styles.links }>
          <Link to = '/login'> Log In </Link>
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

export default withRouter(connect(mapStateToProps)(Reset))