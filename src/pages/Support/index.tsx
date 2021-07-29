import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

export const Support = () => {
  return(
    <div>
      Support
    </div>
  )
}

const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Support))