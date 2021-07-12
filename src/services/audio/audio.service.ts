import { getFirebaseStorage } from '../../helpers/firebase.helper'

const cache: Map<string, Blob> = new Map()

export class AudioService {
  audioCtx: AudioContext
  mainNode: GainNode
  compressor: DynamicsCompressorNode
  reverb: ConvolverNode

  constructor() {
    this.audioCtx = new AudioContext()
    this.mainNode = this.audioCtx.createGain()
    // this.mainNode.connect(this.audioCtx.destination)
    this.compressor = this.audioCtx.createDynamicsCompressor()
    this.compressor.connect(this.audioCtx.destination)
    this.mainNode.connect(this.compressor)
    this.reverb = this.audioCtx.createConvolver()
    this.reverb.connect(this.mainNode)
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
}

export class Sound extends AudioService {
  name: string
  dry1: GainNode
  wet1: GainNode
  source: AudioBufferSourceNode
  lowpassFilter: BiquadFilterNode
  
  constructor(name: string){
    super()
    
    this.name = name
    this.lowpassFilter = this.audioCtx.createBiquadFilter()
    this.source = this.audioCtx.createBufferSource()
    this.dry1 = this.audioCtx.createGain()
    this.wet1 = this.audioCtx.createGain()
    this.source.connect(this.lowpassFilter)
    this.lowpassFilter.connect(this.dry1)
    this.lowpassFilter.connect(this.wet1)
    this.dry1.connect(this.mainNode)
    this.wet1.connect(this.reverb)
    if (this.name === 'Left') {
      this.dry1.gain.value = 0
      this.wet1.gain.value = 0
    } else {
      this.dry1.gain.value = 1
      this.wet1.gain.value = 0
    }
    // this.source = this.audioCtx.createBufferSource()
    // this.soundNode = this.audioCtx.createGain()
    // // this.soundNode.gain.value = 2
    // // this.soundNode.connect(this.mainNode)
    // this.soundNode.connect(this.mainNode)
    
    // this.reverbNode = this.audioCtx.createGain()
    // this.mainNode.connect(this.reverb)
    // this.reverbNode.connect(this.mainNode)
    
    
    
    // this.reverb.connect(this.reverbNode)
    // // this.reverbNode.connect(this.soundNode)
    // this.soundNode.connect(this.reverb)
    // this.reverbNode.connect(this.mainNode)
    
  }

  // setVolume(gain: number) {
  //   this.soundNode.gain.value = gain
  // }

  // setReverb(buffer: any) {
  //   this.reverb.buffer = buffer
  // }

  // setBuffer(buffer: any){
  //   this.source.buffer = buffer
  // }

  onStart() {
    this.source.start(0)
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
        // this.reverbNode.gain.value = .2
        this.reverb.buffer = decodeData
        
        resolve()
      }).catch((e) => console.error(e))
    })
  }
}




