import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ProgressBar, ProgressBarProps } from 'primereact/progressbar'
import { Sidebar }    from 'primereact/sidebar'
import { IconsUI }    from '../../models/enums'
import { Library }    from '../../helpers/firebase.interface'
import { StoreType }  from '../../store/types'
import styles         from './MobileSidebarInfo.module.scss'

interface PropsType {
  current: Library | null,
  setCurerent: (state: Library | null) => void
}

export const MobileSidebarInfo = (props: PropsType) => {
  const { current, setCurerent } = props
  const [ progress, setProgress ] = useState(0)
  const [ playing, setPlaying ] = useState(false) 
  const progressBarProps: ProgressBarProps = {
    id: current?.name,
    value: progress
  }
  const audio = useMemo(() => new Audio(current?.tizer), [current?.tizer])
  const touchProgress = (e: React.TouchEvent) => {
    const offset = e.touches[0].pageX - (e.target as HTMLElement).getBoundingClientRect().left
    const percent = (offset * 100)/(e.target as HTMLElement).clientWidth
    const currentTime = audio.duration * Math.floor(percent) * 0.01
    setProgress(percent)
    audio.currentTime = currentTime
    console.log(currentTime)
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

  return (
    <Sidebar visible = { Boolean(current) } position = 'right' 
      icons = {(<i className = 'icon-close' 
      onTouchStart = {() => setCurerent(null)}/>)} 
      onHide={() => setCurerent(null)}
    >
      <div className = { styles.wrapper }>
        <figure className = { styles.wrapperImage }>
          <img src = { current?.cover_retina } alt = { current?.name } />
        </figure>
        <div onTouchStart = { touchProgress }>
          <ProgressBar { ...progressBarProps }/>
        </div>
        <div className = 'p-d-flex p-jc-around p-pt-3'>
          <button className = 'btn play'>
            <i className = { !playing ? IconsUI.radialPlay: IconsUI.radialPause } 
              onTouchStart = {() => setPlaying(!playing)}/>
              <span>Demo</span>
          </button>
          <button className = 'btn launch'>
            <Link to = {`/app/${ current?.name }`}>Launch</Link>
          </button>
        </div>
        <p className = 'p-my-3'>{ current?.description }</p>
      </div>
    </Sidebar>
  )
}

export default MobileSidebarInfo