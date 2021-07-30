import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
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

  return (
    <Sidebar visible = { Boolean(current) } position = 'right' 
      icons = {(<i className = 'icon-close' onTouchStart = {() => setCurerent(null)}/>)} onHide={() => {}}
    >
      <div className = { styles.wrapper }>
        <figure className = { styles.wrapperImage }>
          <img src = { current?.cover } alt = { current?.name } />
        </figure>
        <div className = 'p-d-flex p-jc-around p-pt-3'>
          <button className = 'btn play'>
            <i className = { IconsUI.radialPlay }/> <span>Demo</span>
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