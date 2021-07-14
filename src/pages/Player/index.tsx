import React, { FC, useEffect, useState, ReactNode, BaseSyntheticEvent } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import useScript from 'react-script-hook'
import { withRouter } from 'react-router-dom'
import { audioService, leftSnd, rightSnd } from '../../services/audio/audio.instance'
import { ReverbType } from './types'
import styles from './Player.module.scss'

const sound1 = 'libraries/Interface/Music/Positive/Digital_01.wav'
const sound2 = 'libraries/Interface/Music/Negative/Digital_01.wav'
const rever1 = 'reverbs/DomesticLivingRoom.wav'
const rever2 = 'reverbs/ElvedenHallLordsCloakroom.wav'
const rever3 = 'reverbs/YorkMinster.wav'

interface PlayerProps {
  children?: ReactNode
  left?: boolean,
  right?: boolean
}

interface ExtendedAudioContext extends AudioContext {
  createReverbFromBase64: (audioBase64: any, callback: Function) => {},
  createReverbFromUrl: (audioUrl: string, callback: Function) => {},
  createReverbFromBase64Url: (audioBase64: any, callback: Function) => {}
}

const defaultReverState = {
  room: false,
  hall: false,
  stadium: false
}

const Player: FC = (props: PlayerProps): JSX.Element =>  {
  // useScript({ 
  //   src: 'http://reverbjs.org/reverb.js',
  //   onload: () => {
  //     console.log((window as any).reverbjs);
  //     (window as any).reverbjs.extend(audioService.audioCtx)
  //     console.log((audioService.audioCtx as ExtendedAudioContext).createReverbFromUrl)
  //   } 
  // })
  const dispatch = useDispatch()
  const [ loading, setLoading ] = useState(false)
  const [ playing, setPlaying ] = useState(false)
  const [ leftReverb, setLeftReverbs ] = useState(defaultReverState)
  const [ rightReverb, setRightReverbs ] = useState(defaultReverState)
  const { left, right } = props
  
  
  useEffect(() => {
    onInit()
  }, [])

  useEffect(() => {
    if (!leftSnd.playing && !rightSnd.playing) {
      setPlaying(false)
    }
  }, [ left, right ])

  useEffect(() => {
    Object.entries(leftReverb).forEach(([type, state]) => {
      
      if (state) {
        leftSnd.setTypeReverb(type as ReverbType)
      } else {
        leftSnd.resetReverb()
      }
    })
    Object.entries(rightReverb).forEach(([type, state]) => {
      
      if (state) {
        rightSnd.setTypeReverb(type as ReverbType)
      } else {
        rightSnd.resetReverb()
      }
    })
    console.log('>>>>', leftReverb, rightReverb)
  }, [ leftReverb, rightReverb ])

  const onClickHandler = () => {
    setLoading(true)
    
    // Promise.all([ 
    //   audioService.loaderBuffer(sound1), 
    //   audioService.loaderBuffer(sound2),
    //   audioService.loaderBuffer(rever1) 
    // ]).then(async ([ blob1, blob2, rever ]) => {
    //     if (blob1) {
    //       const buffer = await blob1?.arrayBuffer()
    //       await leftSnd.onDecodeData(buffer)
    //     }
    //     if (blob2) {
    //       const buffer = await blob2.arrayBuffer()
    //       await rightSnd.onDecodeData(buffer)
    //     }
    //     if (rever) {
    //       const buffer1 = await rever.arrayBuffer()
    //       const buffer2 = await rever.arrayBuffer()
    //       await leftSnd.onReverbDecodeData(buffer1)
    //       await rightSnd.onReverbDecodeData(buffer2)
    //     }
    //     // console.log(rever1)
        
    //     blob1 && leftSnd.onStart()
    //     blob2 && rightSnd.onStart()
    //     setLoading(false)
    //   })
  }

  const loadSound = async (name: string): Promise<ArrayBuffer> => {
    return new Promise(async (resolve) => {
      const blob = await audioService.loaderBuffer(name)
      const buffer = await blob?.arrayBuffer()
      if (buffer) resolve(buffer)
    })
  }

  const onSelectLeftSound = async (sound: string) => {
    setLoading(true)
    leftSnd.selected = sound
    const buffer = await loadSound(sound)
    buffer && await leftSnd.onDecodeData(buffer)
    setLoading(false)
  }

  const onSelectRightSound = async (sound: string) => {
    setLoading(true)
    rightSnd.selected = sound
    const buffer = await loadSound(sound)
    buffer && await rightSnd.onDecodeData(buffer)
    setLoading(false)
  }

  const onPlay = () => {
    if (!leftSnd.selected && !rightSnd.selected) {
      return alert('Выберите звук!')
    }
    setPlaying(true)
    if (leftSnd.selected && !leftSnd.playing) {
      dispatch(leftSnd.onStart())
    }
    if (rightSnd.selected && !rightSnd.playing) {
      dispatch(rightSnd.onStart())
    }
  }

  const onInit = () => {
    Promise.all([
      audioService.loaderReverb(rever1, 'hall'),
      audioService.loaderReverb(rever2, 'room'),
      audioService.loaderReverb(rever3, 'stadium')
    ]).then(([rever1, rever2, rever3]) => {
      
      const sounds = [ leftSnd, rightSnd ]
      sounds.forEach(sound => {
        sound.reverbBuffers['room'] = rever1
        sound.reverbBuffers['hall'] = rever2
        sound.reverbBuffers['stadium'] = rever3
      })
    })
  }

  const changedLeftHandler = (e: BaseSyntheticEvent) => {
    leftSnd.setVolume(e.target.value)
  }

  const changedRightHandler = (e: BaseSyntheticEvent) => {
    rightSnd.setVolume(e.target.value)
  }

  const changedLeftReverbVolume = (e: BaseSyntheticEvent) => {
    leftSnd.setVolumeReverb(e.target.value)
  }

  const changedRightReverbVolume = (e: BaseSyntheticEvent) => {
    rightSnd.setVolumeReverb(e.target.value)
  }

  return (
    <div className = { styles.wrapper }>
      <div className = { styles.leftSide }>
        <ul>
          <li onClick = {() => onSelectLeftSound(sound1)}>Left sound 1</li>
        </ul>
      </div>
      <div className = { styles.player }>
        <div>{ loading ? 'loading' : 'no loading' }</div>
        <div className = { styles.leftVolume }>
          <input type = 'range' onChange = { changedLeftHandler }/>
        </div>
        <div className = { styles.rightVolume }>
          <input type = 'range' onChange = { changedRightHandler }/>
        </div>
        <div className = { styles.leftReverb }>
          <input type = 'range' onChange = { changedLeftReverbVolume }/>
          <label>
            <input type="checkbox" name = 'leftReverb' checked = { leftReverb.room } 
              onChange = {(e) => { setLeftReverbs({ ...defaultReverState, room: !leftReverb.room }) }}
            /> Room
          </label>
          <label>
            <input type="checkbox" name = 'leftReverb' checked = { leftReverb.hall } 
              onChange = {(e) => { setLeftReverbs({ ...defaultReverState, hall: !leftReverb.hall }) }}
            /> Hall
          </label>
          <label>
            <input type="checkbox" name = 'leftReverb' checked = { leftReverb.stadium }
            onChange = {(e) => { setLeftReverbs({ ...defaultReverState, stadium: !leftReverb.stadium }) }}
          /> Stadium
          </label>
        </div>
        <div className = { styles.rightReverb }>
          <input type = 'range' onChange = { changedRightReverbVolume }/>
          <label>
            <input type="checkbox" name = 'rightReverb' checked = { rightReverb.room }
              onChange = {(e) => { setRightReverbs({ ...defaultReverState, room: !rightReverb.room }) }}
            /> Room
          </label>
          <label>
            <input type="checkbox" name = 'rightReverb' checked = { rightReverb.hall }
              onChange = {(e) => { setRightReverbs({ ...defaultReverState, hall: !rightReverb.hall }) }}
            /> Hall
          </label>
          <label>
            <input type="checkbox" name = 'rightReverb' checked = { rightReverb.stadium }
              onChange = {(e) => { setRightReverbs({ ...defaultReverState, stadium: !rightReverb.stadium }) }}
            /> Stadium
          </label>
        </div>
        <div className = { styles.btnPlay }>
        <button onClick = { onPlay }>{ playing ? 'Stop' : 'Play' }</button>
      </div>
      </div>
      <div className = { styles.rightSide }>
        <ul>
          <li onClick = {() => onSelectRightSound(sound2)}>Right sound 1</li>
        </ul>
      </div>
    </div>
  )
}

interface StateToProps {
  player: { 
    left: { playing: boolean },
    right: { playing: boolean }
  }
}

const mapStateToProps = (state: StateToProps) => {
  return {
    left: state.player.left.playing,
    right: state.player.right.playing
  }
}

export default withRouter(connect(mapStateToProps)(Player))