import React, { MouseEvent } from 'react'
import { ProgressBar, ProgressBarProps } from 'primereact/progressbar'
import { LibraryInterface } from '../../models/interfaces'
import styles               from './CarouselItem.module.scss'

enum IconsUi {
  RadialPlay = 'icon-play-radial',
  RadialPause = 'icon-pause-radial'
}
const onLoad = (element: HTMLElement | null | undefined): void => {
  if (!element) return
  element.style.opacity = '1'
}

const onClickPlay = (element: HTMLElement, state: boolean): void => {
  if (!element) return
  element.className = state ? IconsUi.RadialPlay : IconsUi.RadialPause
}

const CarouselItem = (library: LibraryInterface): JSX.Element => {
  const { name, cover, description, data } = library
  const progressBarProps: ProgressBarProps = {
    value: 0
  }
  let playing = false
  

  return (
    <article className = { styles.wrapper } style = {{ opacity: '0' }}>
      <div className = { styles.imageWrapper }>
        <img src = { cover } alt = 'cover_image' onLoad = {(e) => onLoad((e.target as HTMLImageElement).parentElement?.parentElement)}/>
      </div>
      <div className = { styles.footer }>
        {/* <div className = {styles.title}>{ name }</div> */}
        <div className = { styles.controls }>
          <button>Launch</button>
          {/* <Button label = 'Launch'/>*/
          <i 
            className = { IconsUi.RadialPlay } 
            onClick = {(e: MouseEvent) => onClickPlay(e.target as HTMLElement, playing = !playing)}
          /> }
        </div>
        <ProgressBar { ...progressBarProps } />
        
        {/* <p>{ description }</p> */}
      </div>
    </article>
  )
}


export default CarouselItem