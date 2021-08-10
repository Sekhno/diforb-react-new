import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ActiveSound {
  category: string
  sub: string
  sound: string
}

export const playerSlice = createSlice({
  name: 'player',
  initialState: {
    playing: false
  },
  reducers: {
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.playing = action.payload
    },
  }
})

export const { setPlaying } = playerSlice.actions

export default playerSlice.reducer