import { getFirebaseStorage } from '../../helpers/firebase.helper'
import { setPlaying } from '../../pages/Player/playerSlice'
import { SideType } from '../../pages/Player/types'

const cache: Map<string, Blob> = new Map()



export class AudioService {
  audioCtx: AudioContext
  mainNode: GainNode
  compressor: DynamicsCompressorNode
  

  constructor() {
    this.audioCtx   = new AudioContext()
    this.mainNode   = this.audioCtx.createGain()
    this.compressor = this.audioCtx.createDynamicsCompressor()
    this.compressor.connect(this.audioCtx.destination)
    this.mainNode.connect(this.compressor)
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
      dispatch(setPlaying({ key: this.name, value: true }))
      this.playing = true
      this.source.start(0)
      this.source.addEventListener('ended', async () => {
        const blob = await this.loaderBuffer(this.selected)
        const buffer = await blob?.arrayBuffer()
        buffer && await this.onDecodeData(buffer)
        this.playing = false
        dispatch(setPlaying({ key: this.name, value: false }))
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




