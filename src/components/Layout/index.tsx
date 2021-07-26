import React, { useEffect } from 'react'
import { withRouter, useHistory, Link, useLocation, RouteComponentProps } from 'react-router-dom'
import { useSelector, useDispatch }  from 'react-redux'
import { Toolbar }          from 'primereact/toolbar'
import { Button }           from 'primereact/button'
import { Avatar }           from 'primereact/avatar'
import { ScrollPanel }      from 'primereact/scrollpanel';
import { onLogout }         from '../../async/authActions'
import { getFirebaseBackend } from '../../helpers/firebase.helper'
import { StoreType }        from  '../../store/types'
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
  const dispatch = useDispatch()
  const history = useHistory()
  const isLogged = useSelector((state: StoreType) => state.auth.isLogged)
  

  const LeftContents = (): JSX.Element => {
    const leftContentsItems = [
      // { label: 'Libraries', icon: 'icon-libs', to: },
      { label: 'Terms', icon: 'icon-certificate', url: 'terms' },
      { label: 'F.A.Q.', icon: 'icon-info', url: 'faq' }
    ]
    const ItemTemplate = (props: HeaderLeftSideItemType) => {
      const { label, icon, url } = props
      return <Link  className = { styles.headerLink } to = { `/${url}` }>
        <i className = { icon }/>
        <span>{ label }</span>
      </Link> 
    }
    return (
      <React.Fragment>
        {
          leftContentsItems.map(item => <ItemTemplate key = { item.label } { ...item } />)
        }
      </React.Fragment>
    )
    // return <TabMenu model = { leftContentsItems } activeIndex = { 0 } 
    //   onTabChange={(e) => console.log(e.value)}/>
  }
  const RightContents = (): JSX.Element => {
    return (
      <React.Fragment>
        <CustomAvatar/>
        <Button icon = 'icon-logout' onClick = {() => dispatch(onLogout())}/>  
      </React.Fragment>
    )
  }
  const CustomAvatar = (): JSX.Element => {
    const user = getFirebaseBackend()?.getAuthenticatedUser()
    return (
      <React.Fragment>
        <Avatar icon = 'icon-avatar' shape = 'circle'/>
        <span>{ user?.displayName ? user?.displayName : user?.email }</span>
      </React.Fragment>
    )
  }
  const Header = () => {
    return <React.Fragment>
      { 
        location.pathname.substr(1, 3) === 'app' ? null :
        <div className = { styles.container }>
          <Toolbar left = { LeftContents } right = { RightContents }/> 
        </div>
      }
    </React.Fragment>
  }

  useEffect(() => {
    const firebaseBackend = getFirebaseBackend()
    if (firebaseBackend?.getAuthenticatedUser() === null) {
      history.push('/login')
    }
  }, [ isLogged ])
  
  return (
    <div className = { styles.wrapper }>
      <Sidebar className = { styles.sidebar }/>
      <header className = { styles.header }>Header</header>
      <div className = { styles.content }>
        <ScrollPanel style={{width: '100%', height: '100%', overflowY: 'auto'}}>
          { props.children }
        </ScrollPanel>
      </div>
    </div>
  )
}



export default withRouter(Layout)