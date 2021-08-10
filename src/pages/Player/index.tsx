import React, { FC, useEffect, useState, ReactNode, createRef, RefObject, Fragment, SyntheticEvent } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter, useParams } from 'react-router-dom'
import { PlayState, Tween } from 'react-gsap'
import { fromEvent, filter, distinctUntilChanged } from 'rxjs'
import { InputSwitch } from 'primereact/inputswitch'
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
import { ReverbsEnum, ReverbType, KeypressEvent, ActiveSound } from './types'
import { StoreType } from '../../store/types'
import { onLoadLibraries } from '../../async/dashboardAction'
import styles from './index.module.scss'



interface PlayerProps {
  children?: ReactNode
  playing?: boolean
}

const defaultReverState = {
  room: false,
  hall: false,
  stadium: false
}
const defaultActiveSound: ActiveSound = {
  category: '',
  sub: '',
  sound: 'Choice sound...'
}

const DiforbApp: FC = (props: PlayerProps): JSX.Element =>  {
  const { playing } = props
  const { id } = useParams<{id: string}>()
  const canvasRef = createRef()
  const library = useSelector((state: StoreType) => state.dashboard.libraries).filter(v => v.name === id)[0]
  const dispatch = useDispatch()
  const [ activeLeftSound, setActiveLeftSound ] = useState(defaultActiveSound)
  const [ activeRightSound, setActiveRightSound ] = useState(defaultActiveSound)
  const [ loadingLeftSound, setLoadingLeftSound ] = useState(false)
  const [ loadingRightSound, setLoadingRightSound ] = useState(false)
  const [ localPlayingState, setLocalPlayingState ] = useState(false)
  const [ leftMute, setLeftMute ] = useState(true)
  const [ rightMute, setRightMute ] = useState(true)
  const [ leftReverb, setLeftReverbs ] = useState(defaultReverState)
  const [ rightReverb, setRightReverbs ] = useState(defaultReverState)
  const [ activeMenu, setActiveMenu ] = useState(false)
  
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

  useEffect(() => {
    const keypressSubscription = fromEvent(document, KeypressEvent.KEYDOWN).pipe(
      filter((e: Event) => (e as KeyboardEvent).keyCode === 27),
      distinctUntilChanged()
    ).subscribe(escpress => {
      if (escpress.type === KeypressEvent.KEYDOWN) {
        console.log(!activeMenu)
        setActiveMenu(!activeMenu)
      }
    })

    return () => {
      keypressSubscription.unsubscribe()
    }
  }, [ activeMenu ])

  const onSelectLeftSound = async (sound: string) => {
    setLoadingLeftSound(true)
    await setBufferToLeftSide(sound)
    setLoadingLeftSound(false)
  }

  const onSelectRightSound = async (sound: string) => {
    setLoadingRightSound(true)
    await setBufferToRightSide(sound)
    setLoadingRightSound(false)
  }

  const onClickPlay = () => {
    if (!leftSoundBuffer && !rightSoundBuffer) {
      return alert('Выберите звук!')
    }
    dispatch(onPlay())
  }

  return (
    <main className = { activeMenu ? styles.openedMenu : '' }>
      <header className = { styles.header }>
        <div className = { styles.leftSide }>
          <InputSwitch checked = { leftMute } onChange={(e) => setLeftMute(e.value)} />
          <i className = { leftMute ? 'icon-volume' : 'icon-volume-off' }/>
          <span>{ activeLeftSound.sound }</span>
        </div>
        <div className = { styles.rightSide }>
          <InputSwitch checked = { rightMute } onChange={(e) => setRightMute(e.value)} />
          <i className = { rightMute ? 'icon-volume' : 'icon-volume-off' }/>
          <span>{ activeRightSound.sound }</span>
        </div>
      </header>
      <div className = { styles.wrapper }>
        <div className = { styles.leftSide }>
          <LeftSide 
            library = { library } 
            loading = { loadingLeftSound }
            onChangeSound = {(url) => onSelectLeftSound(url)}
            onActive = {(active) => setActiveLeftSound(active)}
          />
        </div>
        <div className = { styles.player }>
          {/* <div style = {{textAlign: 'center'}}>{ loading ? 'loading' : 'no loading' }</div>  */}
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
            loading = { loadingRightSound }
            onChangeSound = {(url) => onSelectRightSound(url)}
            onActive = {(active) => setActiveRightSound(active)}
          />
        </div>
      </div>
    </main>
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