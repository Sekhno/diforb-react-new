import React, { FC, useEffect, useState, ReactNode, useRef, createRef, RefObject } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter, useParams } from 'react-router-dom'
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
import LeftSide from './components/LeftSide'
import RightSide from './components/RightSide'
import { ReverbsEnum, ReverbType } from './types'
import { StoreType } from '../../store/types'
import { onLoadLibraries } from '../../async/dashboardAction'
import styles from './index.module.scss'

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
  const { id } = useParams<{id: string}>()
  const canvasRef = createRef()
  const library = useSelector((state: StoreType) => state.dashboard.libraries).filter(v => v.name === id)[0]
  const dispatch = useDispatch()

  const [ loading, setLoading ] = useState(false)
  const [ localPlayingState, setLocalPlayingState ] = useState(false)
  const [ leftReverb, setLeftReverbs ] = useState(defaultReverState)
  const [ rightReverb, setRightReverbs ] = useState(defaultReverState)
  const { playing } = props
  
  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      setupRoutingGraph(() => {
        saveCanvasElem((canvasRef as RefObject<HTMLCanvasElement>)?.current)
        setupReverbBuffers()
      })
    }
    dispatch(onLoadLibraries())
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
        <LeftSide 
          library = { library } 
        />
        {/* <ul>
          <li onClick = {() => onSelectLeftSound(sound1)}>Left sound 1</li>
        </ul> */}
      </div>
      <div className = { styles.player }>
        <div style = {{textAlign: 'center'}}>{ loading ? 'loading' : 'no loading' }</div> 
        <Player 
          id = { id }
          ref = { canvasRef }
          playing = { localPlayingState }
          changeTimeshiftValue = { changeTimeshiftValue }
          changeLeftVolumeValue = { changeLeftVolumeGain }
          changeRightVolumeValue = { changeRightVolumeGain }
          changeLeftPitchValue = { changeLeftPitchValue }
          changeRightPitchValue = { changeRightPitchValue }
          changeLeftReverVolumeGain = { changeLeftReverVolumeGain }
          changeRightReverVolumeGain = { changeRightReverVolumeGain }
          changeLeftReverType = {(type: ReverbsEnum) => setLeftReverbs({ ...defaultReverState, [type]: !leftReverb[type] })}
          changeRightReverType = {(type: ReverbsEnum) => setRightReverbs({ ...defaultReverState, [type]: !leftReverb[type] })}
          onClickPlay = { onClickPlay }
        />
      </div>
      <div className = { styles.rightSide }>
        <RightSide
          library = { library } 
        />
        {/* <ul>
          <li onClick = {() => onSelectRightSound(sound2)}>Right sound 1</li>
        </ul> */}
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