import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Library } from '../../helpers/firebase.interface'


export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    libraries: <Library[]>[]
  },
  reducers: {
    getLibraries: (state, action: PayloadAction<Library[]>) => {
      state.libraries = action.payload
    },
  }
})

export const { getLibraries } = dashboardSlice.actions

export default dashboardSlice.reducer