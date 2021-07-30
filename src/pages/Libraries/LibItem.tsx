import React, { useState, useEffect, useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { BrowserView, MobileOnlyView } from 'react-device-detect'
import { ProgressBar, ProgressBarProps } from 'primereact/progressbar'
import { Library } from '../../helpers/firebase.interface'
import { IconsUI } from '../../models/enums'
import styles from './LibItem.module.scss'

interface PropsType {
  data: Library
}


export const LibItem = (props: PropsType) => {
  
  const { name, cover, tizer } = props.data
  const history = useHistory()
  const audio = useMemo(() => new Audio(tizer), [tizer])
  const [ progress, setProgress ] = useState(0)
  const [ playing, setPlaying ] = useState(false) 
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

  useEffect(() => {
    if (playing) {
      audio.addEventListener('timeupdate', updateTime)
      audio.play()
    } 
    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.pause()
    }
  }, [ playing ])

  const clickProgress = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const offset = e.pageX - (e.target as HTMLElement).getBoundingClientRect().left
    const percent = (offset * 100)/(e.target as HTMLElement).clientWidth
    const currentTime = audio.duration * Math.floor(percent) * 0.01
    setProgress(percent)
    audio.currentTime = currentTime
    console.log(currentTime)
  }

  return(
    <React.Fragment>
      <BrowserView>
        <div className = { styles.wrapper }>
          <figure onClick = {() => {
            history.push(`/libraries/${name}`)
          }}>
            <img src = { cover } alt = { name } />
          </figure>
          <h1>{ name }</h1>
          <div className = { styles.controls }>
            <div className = { styles.buttons }>
              <Link to = { `/app/${name}` }> Launch </Link>
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
          <figure className = { styles.mobileWrapperImage }>
            <img src = { cover } alt = { name } />
          </figure>
          <section>
            <h1>{ name }</h1>
            <div className = { styles.controls }>
              <div className = { styles.buttons }>
                <Link to = { `/libraries/${name}` }> Info </Link>
                {/* <Link to = { `/app/${name}` }> Launch </Link> */}
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