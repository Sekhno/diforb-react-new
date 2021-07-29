import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styles from './index.module.scss'

export const Tutorial = () => {
  return(
    <div className = { styles.wrapper }>
      <iframe src="https://www.youtube.com/embed/2KUr9BlfCkU" 
        title="YouTube video player" frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen></iframe>
    </div>
  )
}

const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Tutorial))