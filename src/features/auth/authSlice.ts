import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogged: false,
    isResetedPassword: false,
    error: ''
  },
  reducers: {
    loginSuccess: (state) => {
      state.error = ''
      state.isLogged = true
    },
    loginReject: (state, action) => {
      state.error = action.payload
    },
    logoutSuccess: state => {
      state.isLogged = false
    },
    logoutReject: (state, action) => {
      state.error = action.payload
    },
    // logout: state => {
    //   state.isLogged = false
    // },
    reset: state => {
      state.isResetedPassword = true
    },
    resetError: state => {
      state.error = ''
    }
  }
})

export const { 
  loginSuccess, loginReject, 
  logoutSuccess, logoutReject, 
  reset, resetError 
} = authSlice.actions

export default authSlice.reducer