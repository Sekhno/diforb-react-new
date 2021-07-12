import { AudioService, Sound } from './audio.service'

const audioService = new AudioService()

// const leftSnd = Object.assign(Object.create(audioService), new Sound('Left'))
const leftSnd = new Sound('Left')
const rightSnd = new Sound('Right')

// audioService.loaderBuffer('libraries/Interface/Music/Negative/Digital_01.wav')

export { audioService, leftSnd, rightSnd }