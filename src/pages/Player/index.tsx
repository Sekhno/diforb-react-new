import React, { FC, useEffect, useState, ReactNode, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { 
  setupRoutingGraph, 
  setupReverbBuffers,
  setBufferToLeftSide, setBufferToRightSide, 
  changeTimeshiftValue,
  changeLeftVolumeGain, changeRightVolumeGain,
  changeLeftReverVolumeGain, changeRightReverVolumeGain,
  changeLeftPitchValue, changeRightPitchValue,
  leftSoundBuffer, rightSoundBuffer,
  selectLeftReverb, selectRightReverb,
  resetLeftReverb, resetRightReverb,
  saveCanvasElem, 
  onPlay 
} from '../../services/audio/audio.instance'
import Player from './components/Player'
import Diforb from './Diforb/Diforb'
import { ReverbType } from './types'
import styles from './DiforbApp.module.scss'

const sound1 = 'libraries/Interface/Music/Positive/Digital_01.wav'
const sound2 = 'libraries/Interface/Music/Negative/Digital_01.wav'

interface PlayerProps {
  children?: ReactNode
  playing?: boolean
}

const defaultReverState = {
  room: false,
  hall: false,
  stadium: false
}

const DiforbApp: FC = (props: PlayerProps): JSX.Element =>  {
  const canvasRef = useRef(null)
  const dispatch = useDispatch()
  const [ loading, setLoading ] = useState(false)
  const [ localPlayingState, setLocalPlayingState ] = useState(false)
  const [ leftReverb, setLeftReverbs ] = useState(defaultReverState)
  const [ rightReverb, setRightReverbs ] = useState(defaultReverState)
  const { playing } = props
  
  
  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      setupRoutingGraph(() => {
        saveCanvasElem(canvasRef.current)
        setupReverbBuffers()
      })
    }
  }, [])

  useEffect(() => {
    if (!playing) {
      setLocalPlayingState(false)
    } else {
      setLocalPlayingState(true)
    }
  }, [ playing ])

  useEffect(() => {
    const leftStateDisabled = Object.values(leftReverb).every(state => !state)
    const rightStateDisabled = Object.values(rightReverb).every(state => !state)
    if (leftStateDisabled) {
      resetLeftReverb()
    } else {
      Object.entries(leftReverb).forEach(([type, state]) => {
        state && selectLeftReverb(type as ReverbType)
      })
    }
    if (rightStateDisabled) {
      resetRightReverb()
    } else {
      Object.entries(rightReverb).forEach(([type, state]) => {
        state && selectRightReverb(type as ReverbType)
      })
    }
  }, [ leftReverb, rightReverb ])

  const onSelectLeftSound = async (sound: string) => {
    setLoading(true)
    await setBufferToLeftSide(sound)
    setLoading(false)
  }

  const onSelectRightSound = async (sound: string) => {
    setLoading(true)
    await setBufferToRightSide(sound)
    setLoading(false)
  }

  const onClickPlay = () => {
    if (!leftSoundBuffer && !rightSoundBuffer) {
      return alert('Выберите звук!')
    }
    dispatch(onPlay())
  }

  return (
    <div className = { styles.wrapper }>
      <div className = { styles.leftSide }>
        <ul>
          <li onClick = {() => onSelectLeftSound(sound1)}>Left sound 1</li>
        </ul>
      </div>
      <div className = { styles.player }>
        {/* <Diforb/> */}
        <Player />
        {/* <div className = { styles.timeshift }>
          <label>
            Timeshift: 
            <input type = 'range' onChange = {(e) => changeTimeshiftValue(+e.target.value - 50)}/>
          </label>
        </div>
        <div className = { styles.leftVolume }>
          <label>
            Left Volume
            <input type = 'range' onChange = {(e) =>  changeLeftVolumeGain(+e.target.value) }/>
          </label>
        </div>
        <div className = { styles.rightVolume }>
          <label>
            Right Volume
            <input type = 'range' onChange = {(e) => changeRightVolumeGain(+e.target.value)}/>
          </label>
        </div>
        <div className = { styles.leftReverb }>
          <input type = 'range' onChange = {(e) => changeLeftReverVolumeGain(+e.target.value)}/>
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
          <input type = 'range' onChange = {(e) => changeRightReverVolumeGain(+e.target.value)}/>
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
        <div className = { styles.leftPitch }>
          <label>
            Left Pitch <input type = 'range' onChange = {(e) => changeLeftPitchValue(+e.target.value)}/>
          </label>
        </div>
        <div className = { styles.rightPitch }>
          <label>
            Right Pitch <input type = 'range' onChange = {(e) => changeRightPitchValue(+e.target.value)}/>
          </label>
        </div>
        <div className = { styles.btnPlay }>
          <button onClick = { onClickPlay }>{ localPlayingState ? 'Stop' : 'Play' }</button>
        </div>
        <div className = { styles.analizer }>
          <canvas ref = { canvasRef } width = '200' height = '200'></canvas>
        </div>
        <div>{ loading ? 'loading' : 'no loading' }</div> */}
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
    playing: boolean 
  }
}

const mapStateToProps = (state: StateToProps) => {
  return {
    playing: state.player.playing
  }
}

export default withRouter(connect(mapStateToProps)(DiforbApp))