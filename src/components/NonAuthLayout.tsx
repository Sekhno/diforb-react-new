import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { withRouter, RouteComponentProps, useHistory } from 'react-router-dom'
import styles from './NonAuthLayout.module.scss'
import { getFirebaseBackend } from '../helpers/firebase.helper'

interface PropsType extends RouteComponentProps  {
  children: JSX.Element,
}

const NonAuthLayout = (props: PropsType): JSX.Element => {
  const history = useHistory()
  const isLogged = useSelector((state: { auth: {isLogged: boolean} }) => state.auth.isLogged)
  const firebaseBackend = getFirebaseBackend()

  useEffect(() => {
    if (firebaseBackend?.getAuthenticatedUser() !== null) {
      history.push('/home')
    }
  }, [ isLogged ])

  return (
    <div className = { styles.wrapper }>
      <div className = { styles.content }>{ props.children }</div>
    </div>
  )
}

export default withRouter(NonAuthLayout)