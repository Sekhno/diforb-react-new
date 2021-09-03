import React, { useEffect, useState, createRef, Fragment } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter, useParams, Link } from 'react-router-dom'
import { BrowserView, MobileOnlyView } from 'react-device-detect'

import { StoreType }        from '../../store/types'
import { onLoadLibraries }  from '../../async/dashboardAction'
import LibItem              from './LibItem'
import PanelInfo            from './PanelInfo'
import MobileSidebarInfo    from './MobileSidebarInfo'
import { Library } from '../../helpers/firebase.interface'

const Libraries = (): JSX.Element => {
  const libraries = useSelector((state: StoreType) => state.dashboard.libraries)
  const dispatch = useDispatch()
  const [ current, setCurerent ] = useState<Library|null>(null)
  const [ libItemPlaying, setLibItemPlaying ] = useState(null)

  useEffect(() => {
    dispatch(onLoadLibraries())
  }, [])

  return (
    <React.Fragment>
      <BrowserView>
        <PanelInfo/>
        <div className = 'p-grid' style = {{margin: '.2rem'}}>
          {
            !libraries.length
            ? <div className = 'p-col-12'>Downloading</div> 
            : libraries.map(library => (
              <div key = { library.name } className = 'p-col-12 p-md-6 p-lg-3' style = {{ padding: '0.2rem' }}>
                <LibItem 
                  data = { library }
                  libItemPlaying = { libItemPlaying }
                  setLibItemPlaying = { setLibItemPlaying }
                />
              </div>
            ))
          }
        </div>
      </BrowserView>
      <MobileOnlyView>
        <MobileSidebarInfo current = { current } setCurerent = { setCurerent }/>
        <div style = {{ filter: current ? 'blur(3px)' : 'blur(0)' }}>
          {
            libraries.map(library => (
              <div key = { library.name } style = {{ margin: '0.2rem' }}>
                <LibItem 
                  data = { library } setCurrent = { setCurerent }
                  libItemPlaying = { libItemPlaying }
                  setLibItemPlaying = { setLibItemPlaying }
                />
              </div>
            ))
          }
        </div>
      </MobileOnlyView>
    </React.Fragment>
  )
}





const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Libraries))