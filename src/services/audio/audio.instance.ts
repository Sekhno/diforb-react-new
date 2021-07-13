import { AudioService, Sound } from './audio.service'

const audioService = new AudioService()

// const leftSnd = Object.assign(Object.create(audioService), new Sound('Left'))
const leftSnd   = new Sound('left')
const rightSnd  = new Sound('right')


export { audioService, leftSnd, rightSnd }