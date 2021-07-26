import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ProgressBar, ProgressBarProps } from 'primereact/progressbar'
import { Library } from '../../helpers/firebase.interface'
import styles from './LibItem.module.scss'

interface PropsType {
  data: Library
}

enum IconsUI {
  radialPlay = 'icon-play-radial',
  radialPause = 'icon-pause-radial'
}

export const LibItem = (props: PropsType) => {
  const { name, cover } = props.data
  const [ playing, setPlaying ] = useState(false) 
  const progressBarProps: ProgressBarProps = {
    value: 0
  }

  useEffect(() => {
    console.log('Playing: ', playing)
  }, [ playing ])

  return(
    <div className = { styles.wrapper }>
      <figure>
        <img src = { cover } alt = { name } />
      </figure>
      <h1>{ name }</h1>
      <div className = { styles.controls }>
        <div className = { styles.buttons }>
          <Link to = {`/app/${name}`}>Launch</Link>
          <i className = { IconsUI.radialPlay } onClick = {() => setPlaying(!playing)}/>
        </div>
        <ProgressBar { ...progressBarProps } />
      </div>
    </div>
  )
}

export default LibItem