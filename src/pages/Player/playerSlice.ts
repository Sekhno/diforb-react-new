import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const playerSlice = createSlice({
  name: 'player',
  initialState: {
    playing: false,
    leftReverb: '',
    leftAdditionalReverb: '',
    rightReverb: '',
    rightAdditionalReverb: ''
  },
  reducers: {
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.playing = action.payload
    }
  }
})

export const { 
  setPlaying
} = playerSlice.actions

export default playerSlice.reducer