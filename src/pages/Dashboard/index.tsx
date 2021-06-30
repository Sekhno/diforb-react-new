import React from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter, useHistory } from 'react-router-dom'
import { onLogout } from '../../async/authActions'


const Dashboard = () => {
  const dispatch = useDispatch()

  return (
    <nav>
      <button onClick = {() => dispatch(onLogout())}>Logout</button>
    </nav>
  )
}

const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Dashboard))