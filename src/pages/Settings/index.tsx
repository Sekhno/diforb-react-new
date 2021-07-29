import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const Settings = () => {
  return(
    <div>
      Settings
    </div>
  )
}

const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Settings))