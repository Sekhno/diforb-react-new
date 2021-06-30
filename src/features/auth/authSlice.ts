import { createSlice } from '@reduxjs/toolkit'


export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogged: false,
    isResetedPassword: false
  },
  reducers: {
    login: state => {
      state.isLogged = true
    },
    logout: state => {
      state.isLogged = false
    },
    reset: state => {
      state.isResetedPassword = true
    }
  }
})

export const { login, logout, reset } = authSlice.actions

export default authSlice.reducer