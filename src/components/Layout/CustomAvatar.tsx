import React from 'react'
import { getFirebaseBackend } from '../../helpers/firebase.helper'
import DuiAvatar from "../Common/DuiAvatar";

const stylesWrapper = {
  display: 'flex',
  alignItems: 'center'
}

const stylesName = {
  marginLeft: '1rem'
}

export const CustomAvatar = () => {
  const user = getFirebaseBackend()?.getAuthenticatedUser();

  return(
    <div style = { stylesWrapper }>
      <DuiAvatar photo = { user?.photoURL || '' }/>
      <div style = { stylesName }>
        <b>Hello</b> <br /> 
        <span>{ user?.displayName ? user?.displayName : user?.email }</span> 
      </div>
    </div>
  )
}

export default CustomAvatar