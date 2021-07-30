import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, Link } from 'react-router-dom'
import { Sidebar } from 'primereact/sidebar'
import CustomAvatar from './CustomAvatar'
import { onLogout } from '../../async/authActions'
import styles       from './index.module.scss'

interface PropsType {
  visible: boolean
  onHide: () => void
}

export const MobileSidebar = (props: PropsType) => {
  const { visible, onHide } = props
  const dispatch = useDispatch()

  return(
    <Sidebar visible = { visible } onHide={ onHide } icons = {(
      <button className = 'icon-close' onTouchStart = { onHide }/>
    )}>
      <div className = { styles.mobileSidebar }>
        <div className = { styles.user }>
          <CustomAvatar />
          <div className = { styles.controls }>
            <Link to = '/settings'><i className = 'icon-cog'/></Link>
            <i className = 'icon-logout' onTouchStart = {() => dispatch(onLogout())}/>
          </div>
        </div>
        <div className = { styles.simpleLink }>
          <NavLink to = '/libraries' activeClassName = { styles.selected }>
            <i className = 'icon-libs'/>
            <span>Libraries</span>
          </NavLink>
        </div>
        <div className = { styles.simpleLink }>
          <NavLink to = '/tutorial' activeClassName = { styles.selected }>
            <i className = 'icon-play'/>
            <span>Watch Tutorial</span>
          </NavLink>
        </div>
        <div className = { styles.simpleLink }>
          <NavLink to = '/faq' activeClassName = { styles.selected }>
            <i className = 'icon-info'/>
            <span>F.A.Q.</span>
          </NavLink>
        </div>
        <div className = { styles.otherLinks }>
          <NavLink to = '/terms' activeClassName = { styles.selected }>License agreement</NavLink>
          <NavLink to = '/privacy' activeClassName = { styles.selected }>Privacy policy</NavLink>
          <NavLink to = '/support' activeClassName = { styles.selected }>Support</NavLink>
          {/* <NavLink to = '/touch'>Get in touch</NavLink> */}
          <NavLink to = '/reviews' activeClassName = { styles.selected }>Reviews</NavLink>
        </div>
        <div className = { styles.socialLinks }>
          <a className = 'icon-facebook' href = 'https://www.facebook.com/diforb/'/>
          <a className = 'icon-twitter' href = 'https://twitter.com/diforb'/>
        </div>
      </div>
    </Sidebar>
  )
}

export default MobileSidebar