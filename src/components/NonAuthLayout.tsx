import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { withRouter, RouteComponentProps, useHistory } from 'react-router-dom'
import { getFirebaseBackend } from '../helpers/firebase.helper'
import styles from './NonAuthLayout.module.scss'
import videoBackground from '../assets/video/Ambience+sound+library.mp4'


interface PropsType extends RouteComponentProps  {
  children: JSX.Element,
}

const NonAuthLayout = (props: PropsType): JSX.Element => {
  const history = useHistory()
  const isLogged = useSelector((state: { auth: {isLogged: boolean} }) => state.auth.isLogged)
  const firebaseBackend = getFirebaseBackend()

  useEffect(() => {
    if (firebaseBackend?.getAuthenticatedUser() !== null) {
      history.push('/libraries')
    }
  }, [ isLogged ])

  return (
    <div className = { styles.wrapper }>
      <div className = { styles.videoContainer }>
        <video autoPlay loop muted playsInline width = '1280' height = '720'>
          <source src = { videoBackground } type = 'video/mp4'/>
        </video>
      </div>
      <div className = { styles.content }>{ props.children }</div>
    </div>
  )
}

export default withRouter(NonAuthLayout)