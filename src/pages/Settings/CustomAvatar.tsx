import React from 'react'
import { Avatar }             from 'primereact/avatar'
import { getFirebaseBackend } from '../../helpers/firebase.helper'

const stylesWrapper = {
  display: 'flex',
  alignItems: 'center'
}

const stylesName = {
  marginLeft: '1rem'
}

export const CustomAvatar = () => {
  const user = getFirebaseBackend()?.getAuthenticatedUser()
  return(
    <div style = { stylesWrapper }>
      {
        user?.photoURL
        ? <Avatar image = { user?.photoURL } shape = 'circle'/>
        : <Avatar icon = 'icon-avatar' shape = 'circle'/>
      }
      
      <div style = { stylesName }>
        <b>Hello</b> <br /> 
        <span>{ user?.displayName ? user?.displayName : user?.email }</span> 
      </div>
    </div>
  )
}

export default CustomAvatar