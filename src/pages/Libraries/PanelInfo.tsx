import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Panel }            from 'primereact/panel'
import { StoreType }        from '../../store/types'
import { Library }          from '../../helpers/firebase.interface'

export const PanelInfo = () => {
  const { id } = useParams<{id: string}>()
  const [ panelCollapsed, setPanelCollapsed ] = useState(true)
  const [ current, setCurrent ] = useState<Library>()
  const libraries = useSelector((state: StoreType) => state.dashboard.libraries)

  useEffect(() => {
    console.log('ID: ', id)
    setPanelCollapsed(id ? false : true)
    console.log(libraries.find(v => v.name === id))
    id && setCurrent(libraries.find(v => v.name === id))
  }, [ id, libraries])

  return (
    <Panel 
      toggleable collapsed = { panelCollapsed } 
      onToggle = {(e) => setPanelCollapsed(e.value)}>
      <div className = 'p-grid'>
        <div className = 'p-col-12 p-md-6'>
          <figure>
            <img src = { current?.cover } alt = {current?.name} />
          </figure>
        </div>
        <div className = 'p-col-12 p-md-6'>
          { current?.description }
        </div>
        {/* <Link to = '/libraries'>X</Link>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione natus atque temporibus labore omnis aut sunt consequuntur iusto accusamus? Consectetur aut amet earum veniam corporis, unde possimus perferendis provident commodi. */}
      </div>
    </Panel>
  )
}

export default PanelInfo