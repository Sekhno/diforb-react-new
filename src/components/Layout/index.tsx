import React, { useEffect } from 'react'
import { withRouter, RouteComponentProps, useHistory } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { onLogout } from '../../async/authActions'
import { getFirebaseBackend } from '../../helpers/firebase.helper'


interface PropsType extends RouteComponentProps {
  children: JSX.Element
}

const Layout = (props: PropsType): JSX.Element => {
  const history = useHistory()
  const isLogged = useSelector((state: { auth: { isLogged: boolean } }) => state.auth.isLogged)
  const firebaseBackend = getFirebaseBackend()

  useEffect(() => {
    console.log('use Effect', isLogged)
    if (firebaseBackend?.getAuthenticatedUser() === null) {
      history.push('/login')
    }
  }, [ isLogged ])
  
  return (
    <React.Fragment>
      <div>Preload!!!</div>
      <div>{ props.children }</div>
    </React.Fragment>
  )
}



export default withRouter(Layout)