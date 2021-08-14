import React, { useEffect } from 'react'
import { withRouter, useHistory, Link, useLocation, RouteComponentProps } from 'react-router-dom'
import { useSelector }  from 'react-redux'
import { BrowserView, MobileView, MobileOnlyView, TabletView } from 'react-device-detect'
import { ScrollPanel }      from 'primereact/scrollpanel'
import { getFirebaseBackend } from '../../helpers/firebase.helper'
import { StoreType }        from  '../../store/types'
import { IconsUI, Routes }  from '../../models/enums'
import Sidebar              from './Sidebar'
import MobileSidebar        from './MobileSidebar'
import styles               from './index.module.scss'
import { useState } from 'react'


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
  const [ visibleSidebar, setVisibleSidebar ] = useState(false)
  const matched = location.pathname.match(/\/(\w+)/g)?.map(v => v.replace('/',''))
  const currentRoute = matched && matched[0]
  const currentSubroute = matched && matched[1]
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
  
  useEffect(() => {
    const firebaseBackend = getFirebaseBackend()
    if (firebaseBackend?.getAuthenticatedUser() === null) {
      history.push('/login')
    }
  }, [ isLogged ])

  
  
  return (
    <React.Fragment>
      <BrowserView>
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
      </BrowserView>
      <MobileOnlyView>
        <MobileSidebar visible = { visibleSidebar } onHide = {() => setVisibleSidebar(false)}/>
        <div className = { styles.mobileWrapper } style = {{filter: visibleSidebar ?'blur(3px)' : 'blur(0)'}}>
          <header className = { styles.header }>
            <button className = 'icon-menu' onTouchStart = {()=> setVisibleSidebar(!visibleSidebar)}/>
            <span>
              <span className = { styles.currentRoute }>{ currentRoute }</span>
              { currentSubroute && <span className = { styles.currentSubroute  }>/{ currentSubroute }</span> }
            </span>
          </header>
          <div className = { styles.content }>
            { props.children }
          </div>
        </div>
      </MobileOnlyView>
      <TabletView>
        <MobileSidebar visible = { visibleSidebar } onHide = {() => setVisibleSidebar(false)}/>
        <div className = { styles.mobileWrapper } style = {{filter: visibleSidebar ?'blur(3px)' : 'blur(0)'}}>
          <header className = { styles.header }>
            <button className = 'icon-menu' onTouchStart = {()=> setVisibleSidebar(!visibleSidebar)}/>
            <span>
              <span className = { styles.currentRoute }>{ currentRoute }</span>
              { currentSubroute && <span className = { styles.currentSubroute  }>/{ currentSubroute }</span> }
            </span>
          </header>
          <div className = { styles.content }>
            { props.children }
          </div>
        </div>
      </TabletView> 
    </React.Fragment>
  )
}



export default withRouter(Layout)