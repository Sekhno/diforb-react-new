import { getFirebaseStorage } from '../../helpers/firebase.helper'
import { setPlaying } from '../../pages/Player/playerSlice'
import { SideType } from '../../pages/Player/types'
import { drawAudioWave } from '../../pages/Player/utilites'

const cache: Map<string, Blob> = new Map()

var array: Uint8Array | undefined
var dataArray: Uint8Array | undefined



export class AudioService {
  audioCtx: AudioContext
  mainNode: GainNode
  compressor: DynamicsCompressorNode
  soundAnalizer: SoundAnalizer
  canvas: HTMLCanvasElement | null = null
  canvasCtx: CanvasRenderingContext2D | null | undefined = null
  bufferLength: number = 1024

  constructor() {
    this.audioCtx   = new (AudioContext || (window as any).webkitAudioContext)()
    this.mainNode   = this.audioCtx.createGain()
    this.compressor = this.audioCtx.createDynamicsCompressor()
    this.mainNode.connect(this.compressor)
    
    this.soundAnalizer = new SoundAnalizer(this.audioCtx)
    this.compressor.connect(this.soundAnalizer.analyser)
    this.soundAnalizer.analyser.connect(this.audioCtx.destination)
    this.bufferLength = this.soundAnalizer.analyser.frequencyBinCount
    // this.draw()
  }

  draw() {
    
    dataArray = new Uint8Array(this.bufferLength)
    // this.soundAnalizer.analyser.getByteFrequencyData(array)
    this.soundAnalizer.analyser.getByteTimeDomainData(dataArray)
    console.log(dataArray[40], dataArray[42], dataArray[45])
    
    // if (!this.canvasCtx) {
    //   requestAnimationFrame(this.draw.bind(this))
    //   return
    // }
    
    
    var sliceWidth = 200 * 1.0 / this.bufferLength
    var x = 0
    
    if (this.canvasCtx) {
      
      // console.log(dataArray[401], dataArray[42], dataArray[45])
      // for (var i = 0; i < 50; i++) {
      //   var v = dataArray[i] / 128.0
      //   var y = v * this.canvas!.height / 2

      //   if (i === 0) {
      //     this.canvasCtx.moveTo(x, y)
      //   } else {
      //     this.canvasCtx.lineTo(x, y)
      //   }
      //   x += sliceWidth
        
      // }
      
    }
    requestAnimationFrame(this.draw.bind(this))
  }

  addCanvasElement(canvas: HTMLCanvasElement | null) {
    this.canvas = canvas
    this.canvasCtx = canvas?.getContext('2d')
    if (this.canvasCtx && this.canvas) {
      this.canvasCtx.fillStyle = 'rgb(200, 200, 200)'
      this.canvasCtx.fillRect(0, 0, 200, 200)

      this.canvasCtx.lineWidth = 2
      this.canvasCtx.strokeStyle = 'rgb(0, 0, 0)'

      this.canvasCtx.beginPath()
      this.canvasCtx.lineTo(200, 200 / 2)
      this.canvasCtx.stroke()
    }
    

    var sliceWidth = this.canvas!.width * 1.0 / this.bufferLength
  }

  loaderBuffer(urlFile: string): Promise<Blob | undefined> {
    return new Promise((resolve, reject) => {
      if (cache.has(urlFile)) {
        return resolve(cache.get(urlFile))
      }
      const storage = getFirebaseStorage()
      storage.ref()
        .child(urlFile).getDownloadURL()
        .then((url) => {
          const xhr = new XMLHttpRequest()
          xhr.responseType = 'blob'// 'arraybuffer';
          xhr.onload = () => {
            const blob = xhr.response
            cache.set(urlFile, blob)
            resolve(blob)
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

  loaderReverb(urlFile: string, name: 'room' | 'hall' | 'stadium'): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const storage = getFirebaseStorage()
      storage.ref()
        .child(urlFile).getDownloadURL()
        .then((url) => {
          const xhr = new XMLHttpRequest()
          xhr.responseType = 'blob'//'arraybuffer';
          xhr.onload = () => {
            resolve(xhr.response as Blob)
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
}

export class Sound extends AudioService {
  static maxKoef = 3
  name: SideType
  dry: GainNode
  wet: GainNode
  source: AudioBufferSourceNode
  lowpassFilter: BiquadFilterNode
  selected: string  = ''
  playing: boolean = false
  reverb: ConvolverNode
  reverbBuffers: { [key: string]: Blob | null }
  
  
  constructor(name: SideType){
    super()
    this.name           = name
    this.reverb         = this.audioCtx.createConvolver()
    this.lowpassFilter  = this.audioCtx.createBiquadFilter()
    this.source         = this.audioCtx.createBufferSource()
    this.dry            = this.audioCtx.createGain()
    this.wet            = this.audioCtx.createGain()
    this.source.connect(this.lowpassFilter)
    this.lowpassFilter.connect(this.dry)
    this.lowpassFilter.connect(this.wet)
    this.dry.connect(this.mainNode)
    this.wet.connect(this.reverb)
    this.reverb.connect(this.mainNode)
    this.reverbBuffers = {
      room: null,
      hall: null,
      stadium: null
    }
    this.setVolume(50)
    this.setVolumeReverb(50)
  }

  setVolume(value: number) {
    this.dry.gain.value = (value * Sound.maxKoef) / 100
  }

  setVolumeReverb(value: number) {
    this.wet.gain.value = (value * Sound.maxKoef) / 100
  }

  async setTypeReverb(type: 'room' | 'hall' | 'stadium') {
    const blob = this.reverbBuffers[type]
    const buffer = await blob?.arrayBuffer()
    buffer && await this.onReverbDecodeData(buffer)
  }

  resetReverb() {
    this.reverb.buffer = null
    this.reverb.disconnect()
  }

  onSelect(urlFile: string) {
    this.selected = urlFile
  }

  onStart() {
    return (dispatch: Function) => {
      // dispatch(setPlaying({ key: this.name, value: true }))
      this.playing = true
      this.source.start(0)
      this.source.addEventListener('ended', async () => {
        const blob = await this.loaderBuffer(this.selected)
        const buffer = await blob?.arrayBuffer()
        buffer && await this.onDecodeData(buffer)
        this.playing = false
        this.source.disconnect()
        // dispatch(setPlaying({ key: this.name, value: false }))
      }, { once: true })
    }
  }

  onDecodeData(buffer: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      this.audioCtx.decodeAudioData(buffer).then(decodeData => {
        this.source = this.audioCtx.createBufferSource()
        // var semitoneRatio = Math.pow(2, 1/12);
        // this.source.playbackRate.value = Math.pow(semitoneRatio, -5);
        this.source.buffer = decodeData
        this.source.connect(this.lowpassFilter)
        resolve()
      }).catch((e) => console.error(e))
    })
  }

  onReverbDecodeData(buffer: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      this.audioCtx.decodeAudioData(buffer).then(decodeData => {
        this.reverb.buffer = decodeData
        this.reverb.disconnect()
        this.reverb.connect(this.mainNode)
        resolve()
      }).catch((e) => console.error(e))
    })
  }
}

class SoundAnalizer {
  analyser: AnalyserNode
  scriptProcessor: any
  visualizers: any[]
  // canvas: HTMLCanvasElement | null = null
  // canvasCtx: CanvasRenderingContext2D | null | undefined = null
  

  constructor(audioCtx: AudioContext) {
    this.analyser = audioCtx.createAnalyser()
    this.analyser.fftSize = 2048
    this.analyser.smoothingTimeConstant = 0.5
    // this.scriptProcessor = null

    // this.scriptProcessor = !audioCtx.createScriptProcessor
    //   ? (audioCtx as any).createJavaScriptNode(1024, 2, 2)
    //   : audioCtx.createScriptProcessor(1024, 2, 2)

    // this.analyser.connect(this.scriptProcessor)
    // this.scriptProcessor.connect(audioCtx.destination)
    // this.scriptProcessor.connect(audioCtx.destination)
    this.visualizers = []

    // this.scriptProcessor.onaudioprocess = (e:  AudioProcessingEvent) => {
    //   const channelData = e.inputBuffer.getChannelData(0)
    //   this.visualizers.forEach(visualizer => visualizer(channelData, this.canvas?.getContext('2d')))
    //   console.log(channelData[5])
    // }
    
  }

  addVisualizer(visualizer: Function){
    this.visualizers.push(visualizer)
  }

  // addCanvasElement(canvas: HTMLCanvasElement | null) {
  //   this.canvas = canvas
  //   this.canvasCtx = canvas?.getContext('2d')
  // }

  draw() {
    // var frequencyDataLength = this.analyser.frequencyBinCount
    // var dataArray = new Uint8Array(this.bufferLength)
    // var frequencyData = new Uint8Array(frequencyDataLength)
    // const animate = () => {
    //   requestAnimationFrame(animate)
    //   this.analyser.getByteTimeDomainData(dataArray)
    //   this.analyser.getByteFrequencyData(frequencyData)
    //   console.log(dataArray)
    //   console.log(frequencyData)
    // }
    // animate()
    
  }

  
}




