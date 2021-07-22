import React, { useEffect } from 'react'
import { withRouter, RouteComponentProps, useHistory, Link } from 'react-router-dom'
import { useSelector, useDispatch }  from 'react-redux'
import { Toolbar }          from 'primereact/toolbar'
import { Button }           from 'primereact/button'
import { Avatar }           from 'primereact/avatar'
import { TabMenu }          from 'primereact/tabmenu'
import { onLogout }         from '../../async/authActions'
import { getFirebaseBackend } from '../../helpers/firebase.helper'


interface PropsType extends RouteComponentProps {
  children: JSX.Element
}

interface HeaderLeftSideItemType {
  label: string,
  icon: string,
  url: string
}

const Layout = (props: PropsType): JSX.Element => {
  const dispatch = useDispatch()
  const history = useHistory()
  const isLogged = useSelector((state: { auth: { isLogged: boolean } }) => state.auth.isLogged)
  const firebaseBackend = getFirebaseBackend()

  const LeftContents = (): JSX.Element => {
    const leftContentsItems = [
      // { label: 'Libraries', icon: 'icon-libs', to: },
      { label: 'Terms', icon: 'icon-certificate', url: 'terms' },
      { label: 'F.A.Q.', icon: 'icon-info', url: 'faq' }
    ]
    const ItemTemplate = (props: HeaderLeftSideItemType) => {
      const { label, icon, url } = props
      return <Link to = { `/${url}` }>
        <i className = { icon }/>
        <span>{ label }</span>
      </Link> 
    }
    return (
      <React.Fragment>
        {
          leftContentsItems.map(item => <ItemTemplate { ...item } />)
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
        
        <Avatar icon = 'icon-avatar' shape="circle"/>
        <span>{ user?.displayName }</span>
      </React.Fragment>
    )
  }

  useEffect(() => {
    console.log('use Effect', isLogged)
    if (firebaseBackend?.getAuthenticatedUser() === null) {
      history.push('/login')
    }
  }, [ isLogged ])
  
  return (
    <React.Fragment>
      <Toolbar left = { LeftContents } right = { RightContents }/> 
      <div>{ props.children }</div>
    </React.Fragment>
  )
}



export default withRouter(Layout)