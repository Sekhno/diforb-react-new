import React, { FC, useEffect, useState, ReactNode, createRef, RefObject } from 'react'
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
  setBufferToLeftAdditionalSide, setBufferToRightAdditionalSide,
  changeTimeshiftValue,
  changeTimeshiftAdditionalValue,
  changeLeftVolumeGain, changeRightVolumeGain,
  changeLeftAdditionalVolumeGain, changeRightAdditionalVolumeGain,
  changeLeftReverVolumeGain, changeRightReverVolumeGain,
  changeLeftAdditionalReverVolumeGain, changeRightAdditionalReverVolumeGain,
  changeLeftPitchValue, changeRightPitchValue,
  changeLeftAdditionalPitchValue, changeRightAdditionalPitchValue,
  leftSoundBuffer, rightSoundBuffer,
  leftSoundAdditionalBuffer, rightSoundAdditionalBuffer,
  selectLeftReverb, selectRightReverb,
  selectLeftAdditionalReverb, selectRightAdditionalReverb,
  resetLeftReverb, resetRightReverb,
  resetLeftAdditionalReverb, resetRightAdditionalReverb,
  saveCanvasElem, 
  onPlay, onStop,
  muteLeftSound, muteRightSound,
  unmuteLeftSound, unmuteRightSound
} from '../../services/audio/audio.instance'
import Player from './components/Player'
import LeftSide from './components/LeftSide'
import RightSide from './components/RightSide'
import { ReverbsEnum, ReverbType, KeypressEvent, ActiveSound, StateToProps, ReverState } from './types'
import { StoreType } from '../../store/types'
import { onLoadLibraries } from '../../async/dashboardAction'
import LayoutSidebar  from '../../components/Layout/Sidebar'
import layotStyles from '../../components/Layout/index.module.scss'
import styles from './index.module.scss'

interface PlayerProps {
  children?: ReactNode
  playing?: boolean
}
const defaultReverState: ReverState = {
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
  const [ activeLeftAdditionalSound, setActiveLeftAdditionalSound ] = useState(defaultActiveSound)
  const [ activeRightAdditionalSound, setActiveRightAdditionalSound ] = useState(defaultActiveSound)
  const [ loadingLeftSound, setLoadingLeftSound ] = useState(false)
  const [ loadingRightSound, setLoadingRightSound ] = useState(false)
  const [ localPlayingState, setLocalPlayingState ] = useState(false)
  const [ leftMute, setLeftMute ] = useState(true)
  const [ rightMute, setRightMute ] = useState(true)
  const [ leftReverb, setLeftReverbs ] = useState(defaultReverState)
  const [ rightReverb, setRightReverbs ] = useState(defaultReverState)
  const [ leftAdditionalReverb, setLeftAdditionalReverbs ] = useState(defaultReverState)
  const [ rightAdditionalReverb, setRightAdditionalReverbs ] = useState(defaultReverState)
  const [ activeMenu, setActiveMenu ] = useState(false)
  const [ activeSoundAnimationState, setActiveSoundAnimationState ] = useState(PlayState.stopEnd)
  const [ additionalSides, setAdditionalSides ] = useState(false)
  
  
  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      setupRoutingGraph(() => {
        saveCanvasElem((canvasRef as RefObject<HTMLCanvasElement>)?.current)
        setupReverbBuffers()
      })
    }
    dispatch(onLoadLibraries())
    {
      const wrapper = document.querySelector('#wrapper')
      const height: number = (wrapper as HTMLElement).getBoundingClientRect().height
      console.log(height)
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
    const leftAdditionalStateDisabled = Object.values(leftAdditionalReverb).every(state => !state)
    const rightAdditionalStateDisabled = Object.values(rightAdditionalReverb).every(state => !state)
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
    if (leftAdditionalStateDisabled) {
      resetLeftAdditionalReverb()
    } else {
      Object.entries(leftAdditionalReverb).forEach(([type, state]) => {
        state && selectLeftAdditionalReverb(type as ReverbType)
      })
    }
    if (rightAdditionalStateDisabled) {
      resetRightAdditionalReverb()
    } else {
      Object.entries(rightAdditionalReverb).forEach(([type, state]) => {
        state && selectRightAdditionalReverb(type as ReverbType)
      })
    }
  }, [ leftReverb, rightReverb, leftAdditionalReverb, rightAdditionalReverb ])

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

  const onChangeLeftSound = (sound: string) => {
    if (additionalSides) {
      onSelectLeftAdditionalSound(sound)
    } else {
      onSelectLeftSound(sound)
    }
  }
  const onChangeRightSound = (sound: string) => {
    if (additionalSides) {
      onSelectRightAdditionalSound(sound)
    } else {
      onSelectRightSound(sound)
    }
  }
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
  const onSelectLeftAdditionalSound = async (sound: string) => {
    setLoadingLeftSound(true)
    await setBufferToLeftAdditionalSide(sound)
    setLoadingLeftSound(false)
  }
  const onSelectRightAdditionalSound = async (sound: string) => {
    setLoadingLeftSound(true)
    await setBufferToRightAdditionalSide(sound)
    setLoadingLeftSound(false)
  }
  const onClickPlay = () => {
    if (library.four_sound) {
      if (!leftSoundBuffer && !rightSoundBuffer
      && !leftSoundAdditionalBuffer && !rightSoundAdditionalBuffer) {
        return setActiveSoundAnimationState(PlayState.restart)
      }
    } else {
      if (!leftSoundBuffer && !rightSoundBuffer) {
        return setActiveSoundAnimationState(PlayState.restart)
      }
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
  const onChangeTimeshift = (v: number) => {
    setAdditionalSides(prevState => {
      if (prevState) {
        changeTimeshiftAdditionalValue(v)
      } else {
        changeTimeshiftValue(v)
      }
      return prevState
    })
  }
  const onChangeLeftVolumeGain = (v: number) => {
    setAdditionalSides(prevState => {
      if (prevState) {
        changeLeftAdditionalVolumeGain(v)
      } else {
        changeLeftVolumeGain(v)
      }
      return prevState
    })
  }
  const onChangeRightVolumeGain = (v: number) => {
    setAdditionalSides(prevState => {
      if (prevState) {
        changeRightAdditionalVolumeGain(v)
      } else {
        changeRightVolumeGain(v)
      }
      return prevState
    })
  }
  const onChangeLeftReverVolumeGain = (v: number) => {
    setAdditionalSides(prevState => {
      if (prevState) {
        changeLeftAdditionalReverVolumeGain(v)
      } else {
        changeLeftReverVolumeGain(v)
      }
      return prevState
    })
  }
  const onChangeRightReverVolumeGain = (v: number) => {
    setAdditionalSides(prevState => {
      if (prevState) {
        changeRightAdditionalReverVolumeGain(v)
      } else {
        changeRightReverVolumeGain(v)
      }
      return prevState
    })
  }
  const onSetLeftReverbs = (type: ReverbsEnum) => {
    setAdditionalSides(prevState => {
      if (prevState) {
        setLeftAdditionalReverbs({ ...defaultReverState, [type]: !leftAdditionalReverb[type] })
      } else {
        setLeftReverbs({ ...defaultReverState, [type]: !leftReverb[type] })
      }
      return prevState
    })
  }
  const onSetRightReverbs = (type: ReverbsEnum) => {
    setAdditionalSides(prevState => {
      if (prevState) {
        setRightAdditionalReverbs({ ...defaultReverState, [type]: !rightAdditionalReverb[type] })
      } else {
        setRightReverbs({ ...defaultReverState, [type]: !rightReverb[type] })
      }
      return prevState
    })
  }
  const onChangeLeftPitchValue = (v: number) => {
    setAdditionalSides(prevState => {
      if (prevState) {
        changeLeftAdditionalPitchValue(v)
      } else {
        changeLeftPitchValue(v)
      }
      return prevState
    })
  }
  const onChangeRightPitchValue = (v: number) => {
    setAdditionalSides(prevState => {
      if (prevState) {
        changeRightAdditionalPitchValue(v)
      } else {
        changeRightPitchValue(v)
      }
      return prevState
    })
  }

  return (
    <React.Fragment>
      <main className = { activeMenu ? styles.openedMenu : '' }>
        {
          <header className = { styles.header }>
            <div className = { styles.leftSide }>
              <InputSwitch checked = { leftMute } onChange={(e) => onChangeLeftMute(e.value)} />
              <i className = { leftMute ? 'icon-volume' : 'icon-volume-off' }/>
              {
                library?.four_sound &&
                <div className = { styles.switchSides }>
                  <button className = { !additionalSides ? styles.active : '' }
                    onClick = {() => setAdditionalSides(false)}
                  >A</button>
                  <span>or</span>
                  <button className = { additionalSides ? styles.active : '' }
                    onClick = {() => setAdditionalSides(true)}
                  >B</button>
                </div>
              }
              <Timeline target = {
                library?.four_sound ? 
                <span>A: { activeLeftSound.sound } &amp; B: { activeLeftAdditionalSound.sound }</span> :
                <span>{ activeLeftSound.sound }</span>
              } 
                playState = { activeSoundAnimationState }
                onComplete = {() => setActiveSoundAnimationState(PlayState.stopEnd)}>
                <Tween to = {{y: -20}} duration = {.3}/>
                <Tween to = {{y: 0}} ease = 'Bounce.easeOut'/>
              </Timeline>
            </div>
            <div className = { styles.rightSide }>
              <InputSwitch checked = { rightMute } onChange={(e) => onChangeRightMute(e.value)} />
              <i className = { rightMute ? 'icon-volume' : 'icon-volume-off' }/>
              {
                library?.four_sound &&
                <div className = { styles.switchSides }>
                  <button className = { !additionalSides ? styles.active : '' }
                    onClick = {() => setAdditionalSides(false)}
                  >C</button>
                  <span>or</span>
                  <button className = { additionalSides ? styles.active : '' }
                    onClick = {() => setAdditionalSides(true)}
                  >D</button>
                </div>
              }
              <Timeline target = {
                  library?.four_sound ? 
                  <span>C: { activeRightSound.sound } &amp; D: { activeRightAdditionalSound.sound }</span> :
                  <span>{ activeRightSound.sound }</span>
                } 
                playState = { activeSoundAnimationState }
                onComplete = {() => setActiveSoundAnimationState(PlayState.stopEnd)}>
                <Tween to = {{y: -20}} duration = {.3}/>
                <Tween to = {{y: 0}} ease = 'Bounce.easeOut'/>
              </Timeline>
            </div>
          </header>
        }
        <div className = { styles.wrapper } id='wrapper'>
          <div className = { styles.leftSide }>
            {
              library?.four_sound ?
              <React.Fragment>
                {
                  additionalSides ? 
                  <LeftSide 
                    mode = 'main2'
                    library = { library } 
                    loading = { loadingLeftSound }
                    onChangeSound = { onChangeLeftSound }
                    onActive = { setActiveLeftAdditionalSound }
                  /> :
                  <LeftSide 
                    mode = 'main'
                    library = { library } 
                    loading = { loadingLeftSound }
                    onChangeSound = { onChangeLeftSound }
                    onActive = { setActiveLeftSound }
                  />
                }
              </React.Fragment> :
               <LeftSide 
                library = { library } 
                loading = { loadingLeftSound }
                onChangeSound = { onSelectLeftSound }
                onActive = { setActiveLeftSound }
              />
            }
            
          </div>
          <div className = { styles.player }>
            <Player 
              id = { id }
              ref = { canvasRef }
              playing = { localPlayingState }
              changeTimeshiftValue = { onChangeTimeshift }
              changeLeftVolumeValue = { onChangeLeftVolumeGain }
              changeRightVolumeValue = { onChangeRightVolumeGain }
              changeLeftPitchValue = { onChangeLeftPitchValue }
              changeRightPitchValue = { onChangeRightPitchValue }
              changeLeftReverVolumeGain = { onChangeLeftReverVolumeGain }
              changeRightReverVolumeGain = { onChangeRightReverVolumeGain }
              changeLeftReverType = { onSetLeftReverbs }
              changeRightReverType = { onSetRightReverbs }
              onClickPlay = { onClickPlay }
              onClickStop = { onClickStop }
              additionalSides = { additionalSides }
              setAdditionalSides = { setAdditionalSides }
              leftReverbState = {leftReverb}
              rightReverbState = { rightReverb }
              leftAdditionalReverbState = { leftAdditionalReverb }
              rightAdditionalReverbState = { rightAdditionalReverb }

            />
          </div>
          <div className = { styles.rightSide }>
            {
              library?.four_sound ?
              <React.Fragment>
                {
                  additionalSides ?
                  <RightSide
                    mode = 'extra2'
                    library = { library } 
                    loading = { loadingRightSound }
                    onChangeSound = { onChangeRightSound }
                    onActive = { setActiveRightAdditionalSound }
                  /> :
                  <RightSide
                    mode = 'extra'
                    library = { library } 
                    loading = { loadingRightSound }
                    onChangeSound = { onChangeRightSound }
                    onActive = { setActiveRightSound }
                  />
                }
              </React.Fragment> :
              <RightSide
                library = { library } 
                loading = { loadingRightSound }
                onChangeSound = { onSelectRightSound }
                onActive = { setActiveRightSound }
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

const mapStateToProps = (state: StateToProps) => {
  return {
    playing: state.player.playing
  }
}

export default withRouter(connect(mapStateToProps)(DesktopWrapper))