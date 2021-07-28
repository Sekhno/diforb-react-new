import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

export const Tutorial = () => {
  return(
    <div>
      Tutorial
    </div>
  )
}

const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Tutorial))