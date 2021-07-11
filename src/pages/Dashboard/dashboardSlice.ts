import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    libraries: <any[]>[]
  },
  reducers: {
    getLibraries: (state, action: PayloadAction<any[]>) => {
      state.libraries = action.payload
    },
  }
})

export const { getLibraries } = dashboardSlice.actions

export default dashboardSlice.reducer