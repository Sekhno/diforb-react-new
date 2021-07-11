
import { loginSuccess, loginReject, logoutSuccess, logoutReject, reset } from '../features/auth/authSlice'
import { getFirebaseBackend } from '../helpers/firebase.helper'

export const onLogin = (email: string, password: string) => {
  const firebaseBackend = getFirebaseBackend()
  return (dispatch: Function) => {
    firebaseBackend?.loginUser(email, password)
      .then(
        () => {
          dispatch(loginSuccess())
        }
      ).catch((e) => dispatch(loginReject(e)))
    
  }
}

export const onLoginWithSocial = (type: 'google' | 'facebook') => {
  const firebaseBackend = getFirebaseBackend()
  return (dispatch: Function) => {
    firebaseBackend?.socialLoginUser(type)
      .then(
        () => {
          dispatch(loginSuccess())
        }
      ).catch((e) => dispatch(loginReject(e)))
  }
}

export const onLogout = () => {
  const firebaseBackend = getFirebaseBackend()
  return (dispatch: Function) => {
    firebaseBackend?.logout()
      .then(() => {
        dispatch(logoutSuccess())
      }).catch((e) => dispatch(logoutReject(e)))
  }
}

export const onSignUp = (email: string, password: string) => {
  const firebaseBackend = getFirebaseBackend()
  return (dispatch: Function) => {
    firebaseBackend?.registerUser(email, password)
      .then((res) => {
        dispatch(loginSuccess())
      })
      .catch(e => loginReject(e))
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