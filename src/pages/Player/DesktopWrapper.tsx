import React, { FC, useEffect, useState, ReactNode, createRef, RefObject, Fragment, SyntheticEvent } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter, useParams } from 'react-router-dom'
import { PlayState, Tween, Timeline } from 'react-gsap'
import { fromEvent, filter, distinctUntilChanged } from 'rxjs'
import { InputSwitch } from 'primereact/inputswitch'
import { Sidebar } from 'primereact/sidebar'
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
  onPlay, onStop,
  muteLeftSound, muteRightSound,
  unmuteLeftSound, unmuteRightSound  
} from '../../services/audio/audio.instance'
import Player from './components/Player'
import LeftSide from './components/LeftSide'
import RightSide from './components/RightSide'
import { ReverbsEnum, ReverbType, KeypressEvent, ActiveSound } from './types'
import { StoreType } from '../../store/types'
import { onLoadLibraries } from '../../async/dashboardAction'
import LayoutSidebar  from '../../components/Layout/Sidebar'
import layotStyles from '../../components/Layout/index.module.scss'
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

const DesktopWrapper: FC = (props: PlayerProps): JSX.Element =>  {
  const { playing } = props
  const { id } = useParams<{id: string}>()
  const canvasRef = createRef()
  const library = useSelector((state: StoreType) => state.dashboard.libraries).filter(v => v.id === id)[0]
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
  const [ activeSoundAnimationState, setActiveSoundAnimationState ] = useState(PlayState.stopEnd)
  
  const [ leftMainSound, setLeftMainSound ] = useState(false)
  const [ rightExtraSound, setRightExtraSound ] = useState(false)
  const [ activeLeftAdditionalSound, setActiveLeftAdditionalSound ] = useState(defaultActiveSound)
  const [ activeRightAdditionalSound, setActiveRightAdditionalSound ] = useState(defaultActiveSound)

  
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
  const onSelectLeftAdditionalSound = async (sound: string) => {}
  const onSelectRightAdditionalSound = async (sound: string) => {}
  const onClickPlay = () => {
    if (!leftSoundBuffer && !rightSoundBuffer) {
      return setActiveSoundAnimationState(PlayState.restart)
    }
    dispatch(onPlay())
  }
  const onClickStop = () => {
    dispatch(onStop())
  }
  const onChangeLeftMute = (v: boolean) => {
    if (v) unmuteLeftSound()
    else muteLeftSound()
    setLeftMute(v)
  }
  const onChangeRightMute = (v: boolean) => {
    if (v) unmuteRightSound()
    else muteRightSound()
    setRightMute(v)
  }

  return (
    <React.Fragment>
      <main className = { activeMenu ? styles.openedMenu : '' }>
        {
          library?.four_sound ?
          <header className = { styles.header }>
            <div className = { styles.leftSide }>
              <span>A</span>
              <InputSwitch checked = { leftMainSound } onChange={(e) => setLeftMainSound(e.value)} />
              <span>B</span>
              
              
            </div>
            <div className = { styles.rightSide }>
              <span>D</span>
              <InputSwitch checked = { rightExtraSound } onChange={(e) => setRightExtraSound(e.value)} />
              <span>C</span>
            </div>
          </header> :
          <header className = { styles.header }>
            <div className = { styles.leftSide }>
              <InputSwitch checked = { leftMute } onChange={(e) => onChangeLeftMute(e.value)} />
              <i className = { leftMute ? 'icon-volume' : 'icon-volume-off' }/>
              <Timeline target = {<span>{ activeLeftSound.sound }</span>} playState = { activeSoundAnimationState }
                onComplete = {() => setActiveSoundAnimationState(PlayState.stopEnd)}>
                <Tween to = {{y: -20}} duration = {.3}/>
                <Tween to = {{y: 0}} ease = 'Bounce.easeOut'/>
              </Timeline>
            </div>
            <div className = { styles.rightSide }>
              <InputSwitch checked = { rightMute } onChange={(e) => onChangeRightMute(e.value)} />
              <i className = { rightMute ? 'icon-volume' : 'icon-volume-off' }/>
              <Timeline target = {<span>{ activeRightSound.sound }</span>} playState = { activeSoundAnimationState }
                onComplete = {() => setActiveSoundAnimationState(PlayState.stopEnd)}>
                <Tween to = {{y: -20}} duration = {.3}/>
                <Tween to = {{y: 0}} ease = 'Bounce.easeOut'/>
              </Timeline>
            </div>
          </header>
        }
        <div className = { styles.wrapper }>
          <div className = { styles.leftSide }>
            {
              library?.four_sound ?
              <React.Fragment>
                {
                  leftMainSound ? 
                  <LeftSide 
                    mode = 'main2'
                    library = { library } 
                    loading = { loadingLeftSound }
                    onChangeSound = {(url) => onSelectLeftSound(url)}
                    onActive = {(active) => setActiveLeftSound(active)}
                  /> :
                  <LeftSide 
                    mode = 'main'
                    library = { library } 
                    loading = { loadingLeftSound }
                    onChangeSound = {(url) => onSelectLeftSound(url)}
                    onActive = {(active) => setActiveLeftSound(active)}
                  />
                }
              </React.Fragment> :
               <LeftSide 
                library = { library } 
                loading = { loadingLeftSound }
                onChangeSound = {(url) => onSelectLeftSound(url)}
                onActive = {(active) => setActiveLeftSound(active)}
              />
            }
            
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
              onClickStop = { onClickStop }
            />
          </div>
          <div className = { styles.rightSide }>
            {
              library?.four_sound ?
              <React.Fragment>
                {
                  rightExtraSound ?
                  <RightSide
                    mode = 'extra2'
                    library = { library } 
                    loading = { loadingRightSound }
                    onChangeSound = {(url) => onSelectRightSound(url)}
                    onActive = {(active) => setActiveRightSound(active)}
                  /> :
                  <RightSide
                    mode = 'extra'
                    library = { library } 
                    loading = { loadingRightSound }
                    onChangeSound = {(url) => onSelectRightSound(url)}
                    onActive = {(active) => setActiveRightSound(active)}
                  />
                }
              </React.Fragment> :
              <RightSide
                library = { library } 
                loading = { loadingRightSound }
                onChangeSound = {(url) => onSelectRightSound(url)}
                onActive = {(active) => setActiveRightSound(active)}
              />
            }
            
          </div>
        </div>
      </main>
      <Sidebar className = { styles.menu } visible = { activeMenu } fullScreen onHide={() => setActiveMenu(false)}>
        <LayoutSidebar className = { layotStyles.sidebar }/>
      </Sidebar>
    </React.Fragment>
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

export default withRouter(connect(mapStateToProps)(DesktopWrapper))