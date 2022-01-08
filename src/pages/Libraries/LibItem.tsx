import React, { useState, useEffect, useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { BrowserView, MobileOnlyView } from 'react-device-detect'
import { ProgressBar, ProgressBarProps } from 'primereact/progressbar'
import { Skeleton } from 'primereact/skeleton'
import { Library } from '../../helpers/firebase.interface'
import { IconsUI } from '../../models/enums'
import styles from './LibItem.module.scss'

interface PropsType {
  data: Library
  setCurrent?: (current: Library) => void
  libItemPlaying: string | null
  setLibItemPlaying: Function
}

export const LibItem = (props: PropsType) => {
  const { data, setCurrent, libItemPlaying, setLibItemPlaying } = props
  const { name, cover, tizer, id, develop } = data
  const history = useHistory()
  const audio = useMemo(() => new Audio(tizer), [tizer])
  const [ progress, setProgress ] = useState(0)
  const [ playing, setPlaying ] = useState(false) 
  const [ loadedPreview, setLoadedPreview ] = useState(false)
  const progressBarProps: ProgressBarProps = {
    id: name,
    value: progress
  }
  const updateTime = () => {
    if (audio.currentTime === audio.duration) {
      setPlaying(false)
      setProgress(0)
    } else {
      setProgress( (audio.currentTime * 100)/audio.duration) 
    }
  }
  const clickProgress = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const offset = e.pageX - (e.target as HTMLElement).getBoundingClientRect().left
    const percent = (offset * 100)/(e.target as HTMLElement).clientWidth
    const currentTime = audio.duration * Math.floor(percent) * 0.01
    setProgress(percent)
    audio.currentTime = currentTime
  }

  useEffect(() => {
    if (playing) {
      setLibItemPlaying(id)
      audio.addEventListener('timeupdate', updateTime)
      audio.play()
    } 
    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.pause()
    }
  }, [ playing ])

  useEffect(() => {
    if (!audio.paused && libItemPlaying !== id) {
      setPlaying(false)
    }
  }, [ libItemPlaying ])

  return(
    <React.Fragment>
      <BrowserView>
        {/*{*/}
        {/*  !loadedPreview && <Skeleton height = '18vw'/>*/}
        {/*}*/}
        
        <div className = { styles.wrapper } 
             style = {!loadedPreview ? { position: 'absolute', opacity: 0 } : {position: 'static', opacity: 1}}>
          <figure onClick = {() => { history.push(`/libraries/${name}`) }}>
            <img src = { cover } alt = { name }
                 className={ loadedPreview ? styles.loaded : '' }
                 onLoad = {() => setLoadedPreview(true) }/>
          </figure>
          <h1>{ name }</h1>
          <div className = { styles.controls }>
            <div className = { styles.buttons }>
              <Link to = { `/app/${id}` }> Launch </Link>
              <i className = { !playing ? IconsUI.radialPlay: IconsUI.radialPause } 
                onClick = {() => setPlaying(!playing)}/>
            </div>
            <div onClick = { clickProgress }>
              <ProgressBar { ...progressBarProps }/>
            </div>
            
          </div>
        </div>
      </BrowserView>
      <MobileOnlyView>
        <div className = { styles.mobileWrapper }>
          <figure>
            <img src = { cover } alt = { name } onLoad = {() => setLoadedPreview(true)}/>
          </figure>
          <section>
            <h1>{ name }</h1>
            <div className = { styles.controls }>
              <div className = { styles.buttons }>
                <button 
                  onClick = {() => setCurrent && setCurrent(data)}
                >Info</button>
                <i className = { !playing ? IconsUI.radialPlay: IconsUI.radialPause } 
                  onClick = {() => setPlaying(!playing)}/>
              </div>
              <div onClick = { clickProgress }>
                <ProgressBar { ...progressBarProps }/>
              </div>
            </div>
          </section>
        </div>
        
      </MobileOnlyView>
    </React.Fragment>
    
  )
}

export default LibItem