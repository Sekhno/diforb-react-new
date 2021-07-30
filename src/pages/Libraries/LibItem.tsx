import React, { useState, useEffect, useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { BrowserView, MobileOnlyView } from 'react-device-detect'
import { ProgressBar, ProgressBarProps } from 'primereact/progressbar'
import { Sidebar } from 'primereact/sidebar'
import { Library } from '../../helpers/firebase.interface'
import { IconsUI } from '../../models/enums'
import styles from './LibItem.module.scss'

interface PropsType {
  data: Library
}


export const LibItem = (props: PropsType) => {
  const { name, cover, cover_retina, tizer, description } = props.data
  const history = useHistory()
  const audio = useMemo(() => new Audio(tizer), [tizer])
  const [ progress, setProgress ] = useState(0)
  const [ playing, setPlaying ] = useState(false) 
  const [ visibleInfoBar, setVisibleInfoBar ] = useState(false)
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
                <button onTouchStart = {() => setVisibleInfoBar(true)}>About</button>
                {/* <Link to = { `/app/${name}` }> Launch </Link> */}
                <i className = { !playing ? IconsUI.radialPlay: IconsUI.radialPause } 
                  onTouchStart = {() => setPlaying(!playing)}/>
              </div>
              <div>
                <ProgressBar { ...progressBarProps }/>
              </div>
            </div>
          </section>
         
        </div>
        <Sidebar visible = { visibleInfoBar } position = 'right' onHide={() => {}} icons = {(
          <header>
            <i className = 'icon-close' onTouchStart = {() => setVisibleInfoBar(false)}/>
          </header>
        )}>
          <div className = { styles.mobileInfoBar }>
            <figure>
              <img src = { cover } alt = { name } />
            </figure>
            <div className = { styles.controls }>
              <div className = { styles.buttons }>
                <Link to = { `/app/${name}` }> Launch </Link>
                <i className = { !playing ? IconsUI.radialPlay: IconsUI.radialPause } 
                  onTouchStart = {() => setPlaying(!playing)}/>
              </div>
              <div>
                <ProgressBar { ...progressBarProps }/>
              </div>
            </div>
            <p>{ description }</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci, nulla dignissimos? Iste ipsam voluptatem laborum. Aliquam, temporibus! Impedit, repudiandae eius rem voluptatem aperiam, velit, illo libero nostrum quo omnis itaque.</p>
          </div>
        </Sidebar>
      </MobileOnlyView>
    
    </React.Fragment>
    
  )
}

export default LibItem