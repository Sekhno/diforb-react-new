import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Panel }            from 'primereact/panel'
import { StoreType }        from '../../store/types'
import { Library }          from '../../helpers/firebase.interface'
import { IconsUI }          from '../../models/enums'
import styles               from './PanelInfo.module.scss'

export const PanelInfo = () => {
  const { id } = useParams<{id: string}>()
  const [ panelCollapsed, setPanelCollapsed ] = useState(true)
  const [ current, setCurrent ] = useState<Library>()
  const libraries = useSelector((state: StoreType) => state.dashboard.libraries)
  
  const data = current?.data === null && current.main && current.extra 
    ? [ ...current.main, ...current.extra ] 
    : current?.data === null && current.main && current.extra && current.main2 && current.extra2
      ? [ ...current.main,  ...current.extra, ...current.main2, ...current.extra2 ]
      : [ ...(current?.data || []) ]

  

  useEffect(() => {
    setPanelCollapsed(id ? false : true)
    id && setCurrent(libraries.find(v => v.name === id))
  }, [ id, libraries])

  return (
    <Panel 
      toggleable collapsed = { panelCollapsed } 
      onToggle = {(e) => setPanelCollapsed(e.value)}>
      {
        current 
        ? <div className = 'p-grid'>
          <div className = 'p-col-12 p-md-6'>
            <figure className = { styles.image }>
              <img src = { current.cover_retina } alt = {current?.name} style = {{width: '100%'}}/>
            </figure>
            <div className = 'p-d-flex p-jc-around p-pt-3'>
              <button className = 'btn play'>
                <i className = { IconsUI.radialPlay }/> <span>Demo</span>
              </button>
              <button className = 'btn launch'>
                <Link to = {`/app/${ current.id }`}>Launch</Link>
              </button>
            </div>
          </div>
          <div className = 'p-col-12 p-md-6'>
            <div className = 'p-d-flex p-jc-end'>
              <Link to = '/libraries' className = { styles.close }>
                <span>close</span> <i className = 'icon-close'/>
              </Link>
            </div>
            
            <h1 className = { styles.title }>{ current.name }</h1>
            <h2 className = { styles.author }>
              by <span>{current.author}</span> <Link to = '/terms'>(license)</Link>
            </h2>
            <p className = { styles.desc }>{ current.description }</p>
            <div className = { styles.inside }>
              <ul>
                {
                  
                  data.map((category) => {
                    const counts = category.data.reduce((prev, cur) => {
                      if (cur.type === 'subcategory') {
                        return cur.data.reduce((prev) => (prev + 1), prev)
                      }
                      return prev + 1
                    }, 0)
                    return <li key = { category.name }>
                      <i className = { category.icon }/>
                      <span>{ category.name } ({ counts })</span>
                    </li>
                  })
                }
              </ul>
            </div>
          </div>
        </div> 
        : <i> Dowloading... </i>
      }
      
    </Panel>
  )
}


export default PanelInfo