import React from 'react'
import { useDispatch } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { onLogout } from '../../async/authActions'
import styles       from './index.module.scss'
import CustomAvatar from './CustomAvatar'

interface PropsType {
  className: string
}

export const Sidebar = (props: PropsType) => {
  const { className } = props
  const dispatch = useDispatch()

  return(
    <div className = { className }>
      <div className = { styles.logo }>
        <i className = 'icon-logo'></i>
      </div>
      <div className = { styles.user }>
        <CustomAvatar />
        <div className = { styles.controls }>
          <Link to = '/settings'><i className = 'icon-cog'/></Link>
          <i className = 'icon-logout' onClick = {() => dispatch(onLogout())}/>
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
        <a href = 'https://www.facebook.com/diforb/'><i className = 'icon-facebook'></i></a>
        <a href = 'https://twitter.com/diforb'><i className = 'icon-twitter'></i></a>
      </div>
    </div>
  )
}

export default Sidebar