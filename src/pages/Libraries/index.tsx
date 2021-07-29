import React, { useEffect, useState, useRef, Fragment } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter, useParams, Link } from 'react-router-dom'
import { Panel }            from 'primereact/panel'
import { StoreType }        from '../../store/types'
import { onLoadLibraries }  from '../../async/dashboardAction'
import LibItem              from './LibItem'
import PanelInfo            from './PanelInfo'


const Libraries = (): JSX.Element => {
  const libraries = useSelector((state: StoreType) => state.dashboard.libraries)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onLoadLibraries())
  }, [])

  return (
    <React.Fragment>
      <PanelInfo/>
      <div className = 'p-grid' style = {{margin: '.2rem'}}>
        {
          !libraries.length
          ? <div className = 'p-col-12'>Downloading</div> 
          : libraries.map(library => (
            <div key = { library.name } className = 'p-col-12 p-md-6 p-lg-3' style = {{ padding: '0.2rem' }}>
              <LibItem data = { library }/>
            </div>
          ))
        }
      </div>
    </React.Fragment>
  )
}





const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Libraries))