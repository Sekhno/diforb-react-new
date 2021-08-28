import { Recorder } from './record'
import { getFirebaseStorage }   from '../../helpers/firebase.helper'
import { ReverbType }           from '../../pages/Player/types'
import { setPlaying }           from '../../pages/Player/playerSlice'

const rever1 = 'reverbs/DomesticLivingRoom.wav'
const rever2 = 'reverbs/ElvedenHallLordsCloakroom.wav'
const rever3 = 'reverbs/YorkMinster.wav'

let context: AudioContext, analyser: AnalyserNode, compressor: DynamicsCompressorNode
let leftReverb: ConvolverNode, rightReverb: ConvolverNode
let leftAdditionalReverb: ConvolverNode, rightAdditionalReverb: ConvolverNode
let source1: AudioBufferSourceNode, source2: AudioBufferSourceNode
let source3: AudioBufferSourceNode, source4: AudioBufferSourceNode
let leftVolumeGain: GainNode, rightVolumeGain: GainNode
let leftVolumeAdditionalGain: GainNode, rightVolumeAdditionalGain: GainNode
let leftReverbGain: GainNode, rightReverbGain: GainNode
let leftReverbAdditionalGain: GainNode, rightReverbAdditionalGain: GainNode
let leftSoundBuffer: AudioBuffer, rightSoundBuffer: AudioBuffer
let leftSoundAdditionalBuffer: AudioBuffer, rightSoundAdditionalBuffer: AudioBuffer
let reverRoomBuffer: AudioBuffer, reverHallBuffer: AudioBuffer, reverStadiumBuffer: AudioBuffer
let leftPitchValue = 1, rightPitchValue = 1
let leftPitchAdditionalValue = 1, rightPitchAdditionalValue = 1
let timeshiftValue = 0, timeshiftAdditionalValue = 0

var bufferLength: number, dataArray: Uint8Array
var canvas: HTMLCanvasElement | null = null
var canvasCtx: CanvasRenderingContext2D | null = null

let streamDestinationNode: MediaStreamAudioDestinationNode
let recSource: MediaStreamAudioSourceNode
let rec: Recorder
let leftVolumeValue: number = 1, rightVolumeValue: number = 1
let leftVolumeAdditionalValue: number = 1, rightVolumeAdditionalValue: number = 1
let autoPlay = false


const setupRoutingGraph = (callback: Function): void => {
  context = new (window.AudioContext || (window as any).webkitAudioContext)()

  analyser = context.createAnalyser()
  compressor = context.createDynamicsCompressor()

  leftReverb = context.createConvolver()
  rightReverb = context.createConvolver()
  leftAdditionalReverb = context.createConvolver()
  rightAdditionalReverb = context.createConvolver()

  leftVolumeGain = context.createGain()
  rightVolumeGain = context.createGain()
  leftReverbGain = context.createGain()
  rightReverbGain = context.createGain()
  leftVolumeAdditionalGain = context.createGain()
  rightVolumeAdditionalGain = context.createGain()
  leftReverbAdditionalGain = context.createGain()
  rightReverbAdditionalGain = context.createGain()

  analyser.connect(context.destination)
  compressor.connect(analyser)

  leftVolumeGain.connect(leftReverb)
  leftVolumeGain.connect(compressor)
  leftReverb.connect(leftReverbGain)
  leftReverbGain.connect(compressor)
  leftVolumeAdditionalGain.connect(leftAdditionalReverb)
  leftVolumeAdditionalGain.connect(compressor)
  leftAdditionalReverb.connect(leftReverbAdditionalGain)
  leftReverbAdditionalGain.connect(compressor)

  rightVolumeGain.connect(rightReverb)
  rightVolumeGain.connect(compressor)
  rightReverb.connect(rightReverbGain)
  rightReverbGain.connect(compressor)
  rightVolumeAdditionalGain.connect(rightAdditionalReverb)
  rightVolumeAdditionalGain.connect(compressor)
  rightAdditionalReverb.connect(rightReverbAdditionalGain)
  rightReverbAdditionalGain.connect(compressor)

  analyser.fftSize = 2048
  bufferLength = analyser.frequencyBinCount
  dataArray = new Uint8Array(bufferLength)
  analyser.getByteTimeDomainData(dataArray)

  streamDestinationNode = context.createMediaStreamDestination()
  recSource = context.createMediaStreamSource(streamDestinationNode.stream)
  rec = new Recorder(recSource)
  compressor.connect(streamDestinationNode)

  callback && callback()
}

const loadBuffer = (url: string): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const storage = getFirebaseStorage()
    storage.ref()
      .child(url).getDownloadURL()
      .then((url) => {
        const xhr = new XMLHttpRequest()
        xhr.responseType = 'arraybuffer'
        xhr.onload = () => {
          resolve(xhr.response)
        }
        xhr.open('GET', url, true)
        xhr.send()
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

const setBufferToLeftSide = (sound: string): Promise<null> => {
  return new Promise((resolve, reject) => {
    loadBuffer(sound).then((buffer: ArrayBuffer) => {
      context.decodeAudioData(buffer, (data) => {
        leftSoundBuffer = data
        resolve(null)
      })
    })
  })
}

const setBufferToLeftAdditionalSide = (sound: string): Promise<null> => {
  return new Promise((resolve, reject) => {
    loadBuffer(sound).then((buffer: ArrayBuffer) => {
      context.decodeAudioData(buffer, (data) => {
        leftSoundAdditionalBuffer = data
        resolve(null)
      })
    })
  })
}

const setBufferToRightSide = (sound: string): Promise<null> => {
  return new Promise((resolve, reject) => {
    loadBuffer(sound).then((buffer: ArrayBuffer) => {
      context.decodeAudioData(buffer, (data) => {
        rightSoundBuffer = data
        resolve(null)
      })
    })
  })
}

const setBufferToRightAdditionalSide = (sound: string): Promise<null> => {
  return new Promise((resolve, reject) => {
    loadBuffer(sound).then((buffer: ArrayBuffer) => {
      context.decodeAudioData(buffer, (data) => {
        rightSoundAdditionalBuffer = data
        resolve(null)
      })
    })
  })
}

const setupReverbBuffers = async () => {
  context.decodeAudioData((await loadBuffer(rever1)), (buffer) => (reverRoomBuffer = buffer))
  context.decodeAudioData((await loadBuffer(rever2)), (buffer) => (reverHallBuffer = buffer))
  context.decodeAudioData((await loadBuffer(rever3)), (buffer) => (reverStadiumBuffer = buffer))
}

const selectLeftReverb = (type: ReverbType) => {
  leftReverbGain.connect(compressor)
  
  if (type === 'room') {
    leftReverb.buffer = reverRoomBuffer
  } else if (type === 'hall') {
    leftReverb.buffer = reverHallBuffer
  } else if (type === 'stadium') {
    leftReverb.buffer = reverStadiumBuffer
  }
}

const selectRightReverb = (type: ReverbType) => {
  rightReverbGain.connect(compressor)
  if (type === 'room') {
    rightReverb.buffer = reverRoomBuffer
  } else if (type === 'hall') {
    rightReverb.buffer = reverHallBuffer
  } else if (type === 'stadium') {
    rightReverb.buffer = reverStadiumBuffer
  }
}

const selectLeftAdditionalReverb = (type: ReverbType) => {
  leftReverbAdditionalGain.connect(compressor)
  
  if (type === 'room') {
    leftAdditionalReverb.buffer = reverRoomBuffer
  } else if (type === 'hall') {
    leftAdditionalReverb.buffer = reverHallBuffer
  } else if (type === 'stadium') {
    leftAdditionalReverb.buffer = reverStadiumBuffer
  }
}

const selectRightAdditionalReverb = (type: ReverbType) => {
  rightReverbAdditionalGain.connect(compressor)
  if (type === 'room') {
    rightAdditionalReverb.buffer = reverRoomBuffer
  } else if (type === 'hall') {
    rightAdditionalReverb.buffer = reverHallBuffer
  } else if (type === 'stadium') {
    rightAdditionalReverb.buffer = reverStadiumBuffer
  }
}

const resetLeftReverb = () => {
  leftReverbGain && leftReverbGain.disconnect()
}

const resetRightReverb = () => {
  rightReverbGain && rightReverbGain.disconnect()
}

const resetLeftAdditionalReverb = () => {
  leftReverbAdditionalGain && leftReverbAdditionalGain.disconnect()
}

const resetRightAdditionalReverb = () => {
  rightReverbAdditionalGain && rightReverbAdditionalGain.disconnect()
}

const muteLeftSound = () => {
  leftVolumeValue = leftVolumeGain.gain.value
  changeLeftVolumeGain(0)
}

const muteRightSound = () => {
  rightVolumeValue = rightVolumeGain.gain.value
  changeRightVolumeGain(0)
}

const unmuteLeftSound = () => {
  leftVolumeGain.gain.value = leftVolumeValue
}

const unmuteRightSound = () => {
  rightVolumeGain.gain.value = rightVolumeValue
}

const changeLeftVolumeGain = (gain: number) => {
  leftVolumeGain.gain.value = (2 * gain) / 100
}

const changeRightVolumeGain = (gain: number) => {
  rightVolumeGain.gain.value = (2 * gain) / 100
}

const changeLeftAdditionalVolumeGain = (gain: number) => {
  leftVolumeAdditionalGain.gain.value = (2 * gain) / 100
}

const changeRightAdditionalVolumeGain = (gain: number) => {
  rightVolumeAdditionalGain.gain.value = (2 * gain) / 100
}

const changeLeftReverVolumeGain = (gain: number) => {
  leftReverbGain.gain.value = gain / 100
}

const changeRightReverVolumeGain = (gain: number) => {
  rightReverbGain.gain.value = gain / 100
}

const changeLeftAdditionalReverVolumeGain = (gain: number) => {
  leftReverbAdditionalGain.gain.value = gain / 100
}

const changeRightAdditionalReverVolumeGain = (gain: number) => {
  rightReverbAdditionalGain.gain.value = gain / 100
}

const changeLeftPitchValue = (gain: number) => {
  leftPitchValue = 0.01 * (gain + 100 )
  if (source1) {
    source1.playbackRate.value = leftPitchValue
  }
}

const changeRightPitchValue = (gain: number) => {
  rightPitchValue = 0.01 * (gain + 100 )
  if (source1) {
    source2.playbackRate.value = rightPitchValue
  }
}

const changeLeftAdditionalPitchValue = (gain: number) => {
  leftPitchValue = 0.01 * (gain + 100 )
  if (source3) {
    source3.playbackRate.value = leftPitchValue
  }
}

const changeRightAdditionalPitchValue = (gain: number) => {
  rightPitchValue = 0.01 * (gain + 100 )
  if (source4) {
    source4.playbackRate.value = rightPitchValue
  }
}

const changeTimeshiftValue = (gain: number) => {
  timeshiftValue = gain
}

const changeTimeshiftAdditionalValue = (gain: number) => {
  timeshiftAdditionalValue = gain
}

const onPlay = () => {
  return (dispatch: Function) => {
    autoPlay = true
    const init = () => {
      let pausedSource1 = true, pausedSource2 = true
      let pausedSource3 = true, pausedSource4 = true
      rec.clear()
      rec.record()
      
      if (leftSoundBuffer) {
        source1 = context.createBufferSource()
        source1.buffer = leftSoundBuffer
        source1.playbackRate.value = leftPitchValue
        source1.connect(leftVolumeGain)

        if (timeshiftValue < 0) {
          source1.start(context.currentTime + Math.abs(timeshiftValue / 25))
        } else {
          source1.start(context.currentTime)
        }
        source1.addEventListener('ended', () => {
          source1.disconnect()
          pausedSource1 = true
          if (pausedSource1 && pausedSource2 && pausedSource3 && pausedSource4) {
            rec.stop()
            autoPlay && init()
          }
        }, {once: true})
        pausedSource1 = false
      }
      if (rightSoundBuffer) {
        source2 = context.createBufferSource()
        source2.buffer = rightSoundBuffer
        source2.playbackRate.value = rightPitchValue
        source2.connect(rightVolumeGain)

        if (timeshiftValue > 0) {
          source2.start(context.currentTime + (timeshiftValue / 25))
        } else {
          source2.start(context.currentTime)
        }
        source2.addEventListener('ended', () => {
          source2.disconnect()
          pausedSource2 = true
          if (pausedSource1 && pausedSource2 && pausedSource3 && pausedSource4) {
            rec.stop()
            autoPlay && init()
          }
        }, {once: true})
        pausedSource2 = false
      }
      if (leftSoundAdditionalBuffer) {
        source3 = context.createBufferSource()
        source3.buffer = leftSoundAdditionalBuffer
        source3.playbackRate.value = leftPitchAdditionalValue
        source3.connect(leftVolumeAdditionalGain)

        if (timeshiftAdditionalValue < 0) {
          source3.start(context.currentTime + Math.abs(timeshiftAdditionalValue / 25))
        } else {
          source3.start(context.currentTime)
        }
        source3.addEventListener('ended', () => {
          source3.disconnect()
          pausedSource3 = true
          if (pausedSource1 && pausedSource2 && pausedSource3 && pausedSource4) {
            rec.stop()
            autoPlay && init()
          }
        }, {once: true})
        pausedSource3 = false
      }
      if (rightSoundAdditionalBuffer) {
        source4 = context.createBufferSource()
        source4.buffer = rightSoundAdditionalBuffer
        source4.playbackRate.value = rightPitchAdditionalValue
        source4.connect(rightVolumeAdditionalGain)

        if (timeshiftAdditionalValue < 0) {
          source4.start(context.currentTime + Math.abs(timeshiftAdditionalValue / 25))
        } else {
          source4.start(context.currentTime)
        }
        source4.addEventListener('ended', () => {
          source4.disconnect()
          pausedSource4 = true
          if (pausedSource1 && pausedSource2 && pausedSource3 && pausedSource4) {
            rec.stop()
            autoPlay && init()
          }
        }, {once: true})
        pausedSource4 = false
      }
    }
    init()
    dispatch(setPlaying(true))
    
  }
}

const onStop = () => {
  return (dispatch: Function) => {
    autoPlay = false
    if (leftSoundBuffer) {
      source1.disconnect()
    }
    if (rightSoundBuffer) {
      source2.disconnect()
    }
    if (leftSoundAdditionalBuffer) {
      source3.disconnect()
    }
    if (rightSoundAdditionalBuffer) {
      source4.disconnect()
    }
    rec.stop()
    dispatch(setPlaying(false))
  }
}

const saveCanvasElem = (canvasElem: HTMLCanvasElement | null): void => {
  if (canvasElem) {
    console.log(canvas)
    canvas = canvasElem
    canvasCtx = canvasElem.getContext('2d')
    draw()
  }
}

const draw = (): void => {
  requestAnimationFrame(draw)
  analyser.getByteTimeDomainData(dataArray)
  
  if (canvasCtx && canvas) {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
    canvasCtx.lineWidth = 2
    canvasCtx.strokeStyle = 'rgb(255, 255, 255)'
    canvasCtx.beginPath()

    let sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0
      const y = v * canvas.height / 2

      if (i === 0) {
        canvasCtx.moveTo(x, y)
      } else {
        canvasCtx.lineTo(x, y)
      }
      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2)
    canvasCtx.stroke()
  }
}

const loadRecordFile = () => {
  return new Promise((resolve) => {
    rec.exportWAV((file: Blob) => {
      const blobURL = window.URL.createObjectURL(file)
      resolve(blobURL)
    })
  })
}


export { 
  setupRoutingGraph, 
  setupReverbBuffers,
  saveCanvasElem, 
  changeTimeshiftValue,
  changeTimeshiftAdditionalValue,
  changeLeftVolumeGain, changeRightVolumeGain,
  changeLeftAdditionalVolumeGain, changeRightAdditionalVolumeGain,
  changeLeftReverVolumeGain, changeRightReverVolumeGain,
  changeLeftAdditionalReverVolumeGain, changeRightAdditionalReverVolumeGain,
  changeLeftPitchValue, changeRightPitchValue,
  changeLeftAdditionalPitchValue, changeRightAdditionalPitchValue,
  selectLeftReverb, selectRightReverb,
  selectLeftAdditionalReverb, selectRightAdditionalReverb,
  resetLeftReverb, resetRightReverb,
  resetLeftAdditionalReverb, resetRightAdditionalReverb,
  setBufferToLeftSide, setBufferToRightSide,
  setBufferToLeftAdditionalSide, setBufferToRightAdditionalSide,
  leftSoundBuffer, rightSoundBuffer,
  leftSoundAdditionalBuffer, rightSoundAdditionalBuffer,

  onPlay, onStop,
  loadRecordFile,
  muteLeftSound, muteRightSound,
  unmuteLeftSound, unmuteRightSound, 
}