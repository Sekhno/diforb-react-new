
import { login, logout, reset } from '../features/auth/authSlice'
import { getFirebaseBackend } from '../helpers/firebase.helper'

export const onLogin = (email: string, password: string) => {
  const firebaseBackend = getFirebaseBackend()
  return (dispatch: Function) => {
    firebaseBackend?.loginUser(email, password)
      .then(
        () => {
          dispatch(login())
        }
      ).catch((e) => console.error(e))
    
  }
}

export const onLogout = () => {
  const firebaseBackend = getFirebaseBackend()
  return (dispatch: Function) => {
    firebaseBackend?.logout()
      .then(() => {
        dispatch(logout())
      }).catch((e) => console.error(e))
  }
}

export const onSignin = (email: string, password: string) => {
  const firebaseBackend = getFirebaseBackend()
  return (dispatch: Function) => {
    firebaseBackend?.registerUser(email, password)
      .then((res) => {
        dispatch(login())
      })
      .catch(e => console.error(e))
  }
}

export const onResetPassword = (email: string) => {
  const firebaseBackend = getFirebaseBackend()
  return (dispatch: Function) => {
    firebaseBackend?.forgetPassword(email)
      .then((res) => {
        dispatch(reset())
      })
      .catch(e => console.error(e))
  }
}