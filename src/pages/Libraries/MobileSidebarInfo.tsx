import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Sidebar }    from 'primereact/sidebar'
import { IconsUI }    from '../../models/enums'
import { Library }    from '../../helpers/firebase.interface'
import { StoreType }  from '../../store/types'
import styles         from './MobileSidebarInfo.module.scss'

export const MobileSidebarInfo = (props: any) => {
  const [ visibleRight, setVisibleRight] = useState(false)
  const [ current, setCurrent ] = useState<Library>()
  const { id } = useParams<{id: string}>()
  const libraries = useSelector((state: StoreType) => state.dashboard.libraries)


  useEffect(() => {
    setVisibleRight(id ? true : false)
    id && setCurrent(libraries.find(v => v.name === id))
  }, [ id, libraries])

  return (
    <Sidebar visible = { visibleRight } position = 'right' 
      icons = {(<Link to = '/libraries' className = 'icon-close'></Link>)}
      onHide={() => {}}>
      {
        current ?
        <div className = { styles.wrapper }>
          <figure className = { styles.wrapperImage }>
            <img src = { current.cover } alt = { current.name } />
          </figure>
          <div className = 'p-d-flex p-jc-around p-pt-3'>
            <button className = 'btn play'>
              <i className = { IconsUI.radialPlay }/> <span>Demo</span>
            </button>
            <button className = 'btn launch'>
              <Link to = {`/app/${ current.name }`}>Launch</Link>
            </button>
          </div>
          <p className = 'p-my-3'>{ current.description }</p>
        </div>
        : null
      }
    </Sidebar>
  )
}

export default MobileSidebarInfo