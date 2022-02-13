import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { getFirebaseBackend } from '../../helpers/firebase.helper'
import CustomAvatar from './CustomAvatar'
import styles from './index.module.scss'

const Settings = () => {
  const user = getFirebaseBackend()?.getAuthenticatedUser()
  const [ dispayName, setDisPlayName ] = useState(user?.displayName || '')
  const [ email, setEmail ] = useState(user?.email || '')
  
  return(
    <div className = { styles.wrapper }>
      <div className = 'card'>
        <div className = 'p-fluid p-grid'>
          <div className = 'p-field p-col-3'>
            <CustomAvatar/>
          </div>
          <div className = 'p-field p-col-9'>
          
            <div className = 'p-field p-col-12'>
              <span className = 'p-float-label p-mt-3'>
                <InputText className = {styles.inputtext} value = { dispayName }  />
                <label htmlFor = 'inputtext'>Display Name</label>
              </span>
            </div>
            <div className = 'p-field p-col-12'>
              <span className = 'p-float-label p-mt-3'>
                <InputText className = {styles.inputtext} value = { email }  />
                <label htmlFor = 'inputtext'>Email</label>
              </span>
            </div>
            <div className = 'p-field p-col-12 p-mt-3'>
              <Button label = 'Save'/>
            </div>
          </div>
        </div>
      </div> 
    </div>
  )
}

const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Settings))