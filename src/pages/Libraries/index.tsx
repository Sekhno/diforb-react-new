import React, { useEffect, useState, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter }       from 'react-router-dom'
import { StoreType }        from '../../store/types'
import { onLoadLibraries }  from '../../async/dashboardAction'
import LibItem              from './LibItem'


const Libraries = (): JSX.Element => {
  const libraries = useSelector((state: StoreType) => state.dashboard.libraries)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onLoadLibraries())
  }, [])

  return (
    <div className = 'p-grid' style = {{margin: '.2rem'}}>
      {
        !libraries.length
        ? <div className = 'p-col-12'>Downloading</div> 
        : libraries.map(library => (
          <div className = 'p-col-12 p-md-6 p-lg-3' >
            <LibItem data = { library }/>
          </div>
        ))

        
      }
    </div>
  )
}



const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Libraries))