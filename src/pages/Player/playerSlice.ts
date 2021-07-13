import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SideType } from './types'

export const playerSlice = createSlice({
  name: 'player',
  initialState: {
    left: {
      playing: false
    },
    right: {
      playing: false
    }
  },
  reducers: {
    setPlaying: (state, action: PayloadAction<{ key: SideType, value: boolean}>) => {
      state[action.payload.key] = { playing: action.payload.value }
    }
  }
})

export const { setPlaying } = playerSlice.actions

export default playerSlice.reducer