import React, { useEffect } from 'react'
import { withRouter, useHistory, Link, useLocation, RouteComponentProps } from 'react-router-dom'
import { useSelector, useDispatch }  from 'react-redux'
import { ScrollPanel }      from 'primereact/scrollpanel'
import { getFirebaseBackend } from '../../helpers/firebase.helper'
import { StoreType }        from  '../../store/types'
import { IconsUI, Routes }  from '../../models/enums'
import Sidebar              from './Sidebar'
import styles               from './index.module.scss'


interface PropsType extends RouteComponentProps {
  children: JSX.Element,
}

interface HeaderLeftSideItemType {
  label: string,
  icon: string,
  url: string
}

const Layout = (props: PropsType): JSX.Element => {
  const location = useLocation()
  const history = useHistory()
  const isLogged = useSelector((state: StoreType) => state.auth.isLogged)

  useEffect(() => {
    const firebaseBackend = getFirebaseBackend()
    if (firebaseBackend?.getAuthenticatedUser() === null) {
      history.push('/login')
    }
  }, [ isLogged ])

  const mathed = location.pathname.match(/\/(\w+)/g)?.map(v => v.replace('/',''))
  const currentRoute = mathed && mathed[0]
  const currentSubroute = mathed && mathed[1]
  const getHeaderIcon = (): IconsUI => {
    switch (currentRoute) {
      case Routes.Libraries: 
        return IconsUI.libraries
      case Routes.Tutorial:
        return IconsUI.play
      case Routes.Faq:
        return IconsUI.info
      default: 
        return IconsUI.attention
    }
  }
  
  return (
    <React.Fragment>
      {
        currentRoute === 'app'
        ? <ScrollPanel style={{width: '100%', height: '100%', overflowY: 'auto'}}>
          { props.children }
        </ScrollPanel>
        : <div className = { styles.wrapper }>
          <Sidebar className = { styles.sidebar }/>
          <header className = { styles.header }>
            <i className = { getHeaderIcon() }/>
            <span className = { styles.currentRoute }>{ currentRoute }</span>
            { currentSubroute && <span className = { styles.currentSubroute  }>/{ currentSubroute }</span> }
          </header>
          <div className = { styles.content }>
            <ScrollPanel style={{width: '100%', height: '100%', overflowY: 'auto'}}>
              { props.children }
            </ScrollPanel>
          </div>
        </div>
      }
    </React.Fragment>
  )
}



export default withRouter(Layout)